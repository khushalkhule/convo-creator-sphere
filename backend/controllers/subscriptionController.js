
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get user's subscription details
exports.getSubscription = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get subscription
    const [subscriptions] = await pool.query(
      `SELECT 
         s.id as subscription_id, 
         s.status, 
         s.next_billing_date,
         p.id as plan_id,
         p.name as plan_name,
         p.price,
         p.chatbot_limit,
         p.api_call_limit,
         p.storage_limit,
         p.features
       FROM user_subscriptions s
       JOIN subscription_plans p ON s.plan_id = p.id
       WHERE s.user_id = ? AND s.status = 'active'`,
      [user_id]
    );
    
    // Get usage statistics
    const [usageStats] = await pool.query(
      'SELECT * FROM usage_statistics WHERE user_id = ?',
      [user_id]
    );
    
    // Get billing history
    const [invoices] = await pool.query(
      `SELECT 
         id,
         invoice_number,
         amount,
         status,
         billing_date
       FROM invoices
       WHERE user_id = ?
       ORDER BY billing_date DESC
       LIMIT 20`,
      [user_id]
    );
    
    // Format response
    let subscriptionDetails = {};
    
    if (subscriptions.length > 0) {
      const subscription = subscriptions[0];
      subscriptionDetails = {
        id: subscription.subscription_id,
        status: subscription.status,
        next_billing_date: subscription.next_billing_date,
        plan: {
          id: subscription.plan_id,
          name: subscription.plan_name,
          price: subscription.price,
          chatbot_limit: subscription.chatbot_limit,
          api_call_limit: subscription.api_call_limit,
          storage_limit: subscription.storage_limit,
          features: JSON.parse(subscription.features || '{}')
        }
      };
    } else {
      // Provide default plan info for UI development
      subscriptionDetails = {
        id: uuidv4(),
        status: 'active',
        next_billing_date: '2024-05-15',
        plan: {
          id: 'pro-monthly',
          name: 'Pro',
          price: 49.99,
          chatbot_limit: 50,
          api_call_limit: 100000,
          storage_limit: 50,
          features: {
            team_collaboration: true,
            white_label: true,
            advanced_analytics: true
          }
        }
      };
    }
    
    // Format usage
    let usage = {};
    
    if (usageStats.length > 0) {
      const stats = usageStats[0];
      usage = {
        api_calls: {
          used: stats.api_calls_used,
          limit: subscriptionDetails.plan.api_call_limit
        },
        storage: {
          used: stats.storage_used,
          limit: subscriptionDetails.plan.storage_limit
        },
        chatbots: {
          used: stats.chatbots_created,
          limit: subscriptionDetails.plan.chatbot_limit
        }
      };
    } else {
      // Provide sample data for UI development
      usage = {
        api_calls: {
          used: 43210,
          limit: 100000
        },
        storage: {
          used: 12.5,
          limit: 50
        },
        chatbots: {
          used: 12,
          limit: 50
        }
      };
    }
    
    // Format invoices
    let billingHistory = invoices.map(invoice => ({
      id: invoice.id,
      invoice_number: invoice.invoice_number,
      amount: invoice.amount,
      status: invoice.status,
      date: invoice.billing_date
    }));
    
    // Provide sample invoices if none exist
    if (billingHistory.length === 0) {
      const currentDate = new Date();
      
      for (let i = 0; i < 3; i++) {
        const invoiceDate = new Date(currentDate);
        invoiceDate.setMonth(currentDate.getMonth() - i);
        
        billingHistory.push({
          id: uuidv4(),
          invoice_number: `INV-2024-${(4 - i).toString().padStart(2, '0')}${Math.floor(Math.random() * 10)}${Math.floor(Math.random() * 10)}`,
          amount: 49.99,
          status: 'paid',
          date: invoiceDate.toISOString().split('T')[0]
        });
      }
    }
    
    res.status(200).json({
      subscription: subscriptionDetails,
      usage,
      billing_history: billingHistory
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available subscription plans
exports.getPlans = async (req, res) => {
  try {
    const [plans] = await pool.query('SELECT * FROM subscription_plans');
    
    // Format plans
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      chatbot_limit: plan.chatbot_limit,
      api_call_limit: plan.api_call_limit,
      storage_limit: plan.storage_limit,
      features: JSON.parse(plan.features || '{}')
    }));
    
    // Provide sample data if no plans exist
    if (formattedPlans.length === 0) {
      const samplePlans = [
        {
          id: 'basic-monthly',
          name: 'Basic',
          price: 19.99,
          chatbot_limit: 5,
          api_call_limit: 10000,
          storage_limit: 10,
          features: {
            team_collaboration: false,
            white_label: false,
            advanced_analytics: false
          }
        },
        {
          id: 'pro-monthly',
          name: 'Pro',
          price: 49.99,
          chatbot_limit: 50,
          api_call_limit: 100000,
          storage_limit: 50,
          features: {
            team_collaboration: true,
            white_label: true,
            advanced_analytics: true
          }
        },
        {
          id: 'enterprise-monthly',
          name: 'Enterprise',
          price: 199.99,
          chatbot_limit: 200,
          api_call_limit: 500000,
          storage_limit: 250,
          features: {
            team_collaboration: true,
            white_label: true,
            advanced_analytics: true,
            dedicated_support: true,
            custom_integrations: true
          }
        }
      ];
      
      res.status(200).json(samplePlans);
    } else {
      res.status(200).json(formattedPlans);
    }
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upgrade subscription plan
exports.upgradePlan = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { plan_id } = req.body;
    
    // Verify plan exists
    const [plans] = await pool.query(
      'SELECT * FROM subscription_plans WHERE id = ?',
      [plan_id]
    );
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Get current subscription
    const [subscriptions] = await pool.query(
      'SELECT id FROM user_subscriptions WHERE user_id = ? AND status = "active"',
      [user_id]
    );
    
    // Calculate next billing date (30 days from now)
    const nextBillingDate = new Date();
    nextBillingDate.setDate(nextBillingDate.getDate() + 30);
    const formattedNextBillingDate = nextBillingDate.toISOString().split('T')[0];
    
    if (subscriptions.length > 0) {
      // Update existing subscription
      await pool.query(
        'UPDATE user_subscriptions SET plan_id = ?, next_billing_date = ? WHERE id = ?',
        [plan_id, formattedNextBillingDate, subscriptions[0].id]
      );
      
      // Create invoice for the new plan
      const invoiceId = uuidv4();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      await pool.query(
        `INSERT INTO invoices 
           (id, user_id, subscription_id, invoice_number, amount, status, billing_date) 
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)`,
        [invoiceId, user_id, subscriptions[0].id, invoiceNumber, plans[0].price, 'paid']
      );
      
      res.status(200).json({
        subscription_id: subscriptions[0].id,
        plan_id,
        next_billing_date: formattedNextBillingDate,
        message: 'Subscription upgraded successfully'
      });
    } else {
      // Create new subscription
      const subscriptionId = uuidv4();
      await pool.query(
        `INSERT INTO user_subscriptions 
           (id, user_id, plan_id, status, next_billing_date) 
         VALUES (?, ?, ?, 'active', ?)`,
        [subscriptionId, user_id, plan_id, formattedNextBillingDate]
      );
      
      // Create invoice
      const invoiceId = uuidv4();
      const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      
      await pool.query(
        `INSERT INTO invoices 
           (id, user_id, subscription_id, invoice_number, amount, status, billing_date) 
         VALUES (?, ?, ?, ?, ?, ?, CURRENT_DATE)`,
        [invoiceId, user_id, subscriptionId, invoiceNumber, plans[0].price, 'paid']
      );
      
      res.status(201).json({
        subscription_id: subscriptionId,
        plan_id,
        next_billing_date: formattedNextBillingDate,
        message: 'Subscription created successfully'
      });
    }
  } catch (error) {
    console.error('Upgrade plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel subscription
exports.cancelSubscription = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get current subscription
    const [subscriptions] = await pool.query(
      'SELECT id FROM user_subscriptions WHERE user_id = ? AND status = "active"',
      [user_id]
    );
    
    if (subscriptions.length === 0) {
      return res.status(404).json({ message: 'No active subscription found' });
    }
    
    // Update subscription status
    await pool.query(
      'UPDATE user_subscriptions SET status = "cancelled" WHERE id = ?',
      [subscriptions[0].id]
    );
    
    res.status(200).json({
      subscription_id: subscriptions[0].id,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
