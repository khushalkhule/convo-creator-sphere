
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// Razorpay credentials
const RAZORPAY_KEY_ID = 'rzp_test_G4xk6OLU6NVkQj';
const RAZORPAY_SECRET = 'xxxxxxxxxxxxxxxxxxxxxxxx'; // Replace this with your test secret

// Get user's subscription details
exports.getSubscription = async (req, res) => {
  try {
    const user_id = req.user.id;
    
    // Get subscription
    const [subscriptions] = await pool.query(
      `SELECT 
         s.id as subscription_id, 
         s.status, 
         s.current_period_end as next_billing_date,
         p.id as plan_id,
         p.name as plan_name,
         p.price,
         p.chatbot_limit,
         p.api_calls_limit,
         p.storage_limit,
         p.features,
         p.interval
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
          interval: subscription.interval,
          chatbot_limit: subscription.chatbot_limit,
          api_call_limit: subscription.api_calls_limit,
          storage_limit: subscription.storage_limit,
          features: subscription.features ? JSON.parse(subscription.features) : []
        }
      };
    } else {
      // Provide default free plan info if no subscription exists
      subscriptionDetails = {
        id: null,
        status: 'inactive',
        next_billing_date: null,
        plan: {
          id: 'free',
          name: 'Free',
          price: 0,
          interval: 'monthly',
          chatbot_limit: 1,
          api_call_limit: 1000,
          storage_limit: 100,
          features: ['1 Chatbot', '1,000 API calls/month', '100MB storage']
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
      // Provide sample data for new users
      usage = {
        api_calls: {
          used: 0,
          limit: subscriptionDetails.plan.api_call_limit
        },
        storage: {
          used: 0,
          limit: subscriptionDetails.plan.storage_limit
        },
        chatbots: {
          used: 0,
          limit: subscriptionDetails.plan.chatbot_limit
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
    const [plans] = await pool.query('SELECT * FROM subscription_plans ORDER BY price ASC');
    
    // Format plans
    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      interval: plan.interval,
      is_popular: plan.is_popular === 1,
      chatbot_limit: plan.chatbot_limit,
      api_calls_limit: plan.api_calls_limit,
      storage_limit: plan.storage_limit,
      features: plan.features ? JSON.parse(plan.features) : []
    }));
    
    res.status(200).json(formattedPlans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const planId = req.params.id;
    
    const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    const plan = plans[0];
    
    // Format plan
    const formattedPlan = {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      price: plan.price,
      interval: plan.interval,
      is_popular: plan.is_popular === 1,
      chatbot_limit: plan.chatbot_limit,
      api_calls_limit: plan.api_calls_limit,
      storage_limit: plan.storage_limit,
      features: plan.features ? JSON.parse(plan.features) : []
    };
    
    res.status(200).json(formattedPlan);
  } catch (error) {
    console.error('Get plan by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a payment order (for Razorpay)
exports.createOrder = async (req, res) => {
  try {
    const { plan_id } = req.body;
    const user_id = req.user.id;
    
    // Get plan details
    const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id]);
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    const plan = plans[0];
    
    // Create a mock order (in a real implementation, you would call Razorpay API here)
    const orderId = `order_${Date.now()}`;
    const amount = Math.round(plan.price * 100); // Razorpay requires amount in paise (100 paise = 1 INR)
    
    // Store order in database for verification later
    const paymentId = uuidv4();
    await pool.query(
      `INSERT INTO payment_orders (id, user_id, plan_id, order_id, amount, status, created_at)
       VALUES (?, ?, ?, ?, ?, 'created', CURRENT_TIMESTAMP)`,
      [paymentId, user_id, plan_id, orderId, amount]
    );
    
    res.status(200).json({
      id: orderId,
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify payment and activate subscription
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, plan_id } = req.body;
    const user_id = req.user.id;
    
    // In a real implementation, you would verify the signature with Razorpay
    // This is a simplified mock implementation
    
    // Get the plan details
    const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [plan_id]);
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    const plan = plans[0];
    
    // Check for existing subscription
    const [existingSubscriptions] = await pool.query(
      'SELECT id FROM user_subscriptions WHERE user_id = ? AND status = "active"',
      [user_id]
    );
    
    // Calculate next billing date
    const nextBillingDate = new Date();
    if (plan.interval === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }
    
    const subscriptionId = existingSubscriptions.length > 0 
      ? existingSubscriptions[0].id 
      : uuidv4();
    
    if (existingSubscriptions.length > 0) {
      // Update existing subscription
      await pool.query(
        `UPDATE user_subscriptions SET 
           plan_id = ?,
           current_period_start = CURRENT_TIMESTAMP,
           current_period_end = ?,
           status = 'active',
           cancel_at_period_end = FALSE,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [plan_id, nextBillingDate, subscriptionId]
      );
    } else {
      // Create new subscription
      await pool.query(
        `INSERT INTO user_subscriptions 
           (id, user_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end)
         VALUES (?, ?, ?, 'active', CURRENT_TIMESTAMP, ?, FALSE)`,
        [subscriptionId, user_id, plan_id, nextBillingDate]
      );
      
      // Create or update usage statistics
      const [existingStats] = await pool.query(
        'SELECT id FROM usage_statistics WHERE user_id = ?',
        [user_id]
      );
      
      if (existingStats.length === 0) {
        await pool.query(
          `INSERT INTO usage_statistics (id, user_id, api_calls_used, storage_used, chatbots_created)
           VALUES (?, ?, 0, 0, 0)`,
          [uuidv4(), user_id]
        );
      }
    }
    
    // Create invoice
    const invoiceId = uuidv4();
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
    
    await pool.query(
      `INSERT INTO invoices 
         (id, user_id, subscription_id, invoice_number, amount, status, billing_date)
       VALUES (?, ?, ?, ?, ?, 'paid', CURRENT_DATE)`,
      [invoiceId, user_id, subscriptionId, invoiceNumber, plan.price]
    );
    
    // Update payment order status
    await pool.query(
      `UPDATE payment_orders SET 
         payment_id = ?,
         status = 'completed',
         completed_at = CURRENT_TIMESTAMP
       WHERE order_id = ?`,
      [razorpay_payment_id, razorpay_order_id]
    );
    
    res.status(200).json({
      success: true,
      message: 'Payment verified and subscription activated',
      subscription_id: subscriptionId
    });
  } catch (error) {
    console.error('Verify payment error:', error);
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
    
    // Calculate next billing date based on plan interval
    const nextBillingDate = new Date();
    if (plans[0].interval === 'monthly') {
      nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
    } else {
      nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
    }
    
    const currentDate = new Date();
    
    if (subscriptions.length > 0) {
      // Update existing subscription
      await pool.query(
        `UPDATE user_subscriptions SET 
          plan_id = ?, 
          current_period_start = ?, 
          current_period_end = ?, 
          status = 'active',
          cancel_at_period_end = FALSE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?`,
        [plan_id, currentDate, nextBillingDate, subscriptions[0].id]
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
        current_period_start: currentDate,
        current_period_end: nextBillingDate,
        message: 'Subscription upgraded successfully'
      });
    } else {
      // Create new subscription
      const subscriptionId = uuidv4();
      await pool.query(
        `INSERT INTO user_subscriptions 
           (id, user_id, plan_id, status, current_period_start, current_period_end, cancel_at_period_end) 
         VALUES (?, ?, ?, 'active', ?, ?, FALSE)`,
        [subscriptionId, user_id, plan_id, currentDate, nextBillingDate]
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
        current_period_start: currentDate,
        current_period_end: nextBillingDate,
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
    
    // Update subscription - set to cancel at period end
    await pool.query(
      'UPDATE user_subscriptions SET cancel_at_period_end = TRUE WHERE id = ?',
      [subscriptions[0].id]
    );
    
    res.status(200).json({
      subscription_id: subscriptions[0].id,
      message: 'Subscription will be cancelled at the end of the billing period'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all subscribers (admin only)
exports.getAllSubscribers = async (req, res) => {
  try {
    // Get all active subscriptions with user details
    const [subscribers] = await pool.query(
      `SELECT 
         u.id as user_id,
         u.name,
         u.email,
         s.id as subscription_id,
         s.status,
         s.current_period_start as started,
         s.current_period_end as next_billing_date,
         p.name as plan_name,
         p.price,
         p.interval
       FROM user_subscriptions s
       JOIN users u ON s.user_id = u.id
       JOIN subscription_plans p ON s.plan_id = p.id
       ORDER BY s.created_at DESC`
    );
    
    // Format response
    const formattedSubscribers = subscribers.map(sub => ({
      id: sub.user_id,
      name: sub.name,
      email: sub.email,
      plan: sub.plan_name,
      started: sub.started,
      nextBilling: sub.next_billing_date,
      amount: `$${sub.price}/${sub.interval === 'monthly' ? 'mo' : 'yr'}`,
      status: sub.status
    }));
    
    res.status(200).json(formattedSubscribers);
  } catch (error) {
    console.error('Get subscribers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new subscription plan (admin only)
exports.createPlan = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      interval, 
      features, 
      is_popular, 
      chatbot_limit, 
      api_calls_limit, 
      storage_limit 
    } = req.body;
    
    // Validate required fields
    if (!name || !price || !interval) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create new plan
    const planId = uuidv4();
    
    await pool.query(
      `INSERT INTO subscription_plans 
        (id, name, description, price, interval, features, is_popular, chatbot_limit, api_calls_limit, storage_limit) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        planId, 
        name, 
        description || '', 
        price, 
        interval, 
        JSON.stringify(features || []),
        is_popular ? 1 : 0,
        chatbot_limit || 1,
        api_calls_limit || 1000,
        storage_limit || 100
      ]
    );
    
    res.status(201).json({
      id: planId,
      name,
      description,
      price,
      interval,
      features,
      is_popular,
      chatbot_limit,
      api_calls_limit,
      storage_limit,
      message: 'Plan created successfully'
    });
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a subscription plan (admin only)
exports.updatePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    const { 
      name, 
      description, 
      price, 
      interval, 
      features, 
      is_popular, 
      chatbot_limit, 
      api_calls_limit, 
      storage_limit 
    } = req.body;
    
    // Check if plan exists
    const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Update plan
    await pool.query(
      `UPDATE subscription_plans 
       SET name = ?, 
           description = ?, 
           price = ?, 
           interval = ?, 
           features = ?, 
           is_popular = ?, 
           chatbot_limit = ?, 
           api_calls_limit = ?, 
           storage_limit = ? 
       WHERE id = ?`,
      [
        name || plans[0].name,
        description !== undefined ? description : plans[0].description,
        price !== undefined ? price : plans[0].price,
        interval || plans[0].interval,
        features ? JSON.stringify(features) : plans[0].features,
        is_popular !== undefined ? (is_popular ? 1 : 0) : plans[0].is_popular,
        chatbot_limit !== undefined ? chatbot_limit : plans[0].chatbot_limit,
        api_calls_limit !== undefined ? api_calls_limit : plans[0].api_calls_limit,
        storage_limit !== undefined ? storage_limit : plans[0].storage_limit,
        planId
      ]
    );
    
    res.status(200).json({
      id: planId,
      message: 'Plan updated successfully'
    });
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a subscription plan (admin only)
exports.deletePlan = async (req, res) => {
  try {
    const planId = req.params.id;
    
    // Check if plan exists
    const [plans] = await pool.query('SELECT * FROM subscription_plans WHERE id = ?', [planId]);
    
    if (plans.length === 0) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Check if any users are subscribed to this plan
    const [subscriptions] = await pool.query(
      'SELECT COUNT(*) as count FROM user_subscriptions WHERE plan_id = ? AND status = "active"',
      [planId]
    );
    
    if (subscriptions[0].count > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete plan with active subscribers. Move subscribers to another plan first.' 
      });
    }
    
    // Delete plan
    await pool.query('DELETE FROM subscription_plans WHERE id = ?', [planId]);
    
    res.status(200).json({
      message: 'Plan deleted successfully'
    });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
