
const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Get sales overview data
exports.getSalesOverview = async (req, res) => {
  try {
    const { period = '6' } = req.query; // Default to last 6 months
    const months = parseInt(period);
    
    // Get current month and previous month for comparison
    const currentDate = new Date();
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Calculate the previous period for comparison
    const previousDate = new Date();
    previousDate.setMonth(previousDate.getMonth() - months);
    const startMonth = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Get monthly revenue data
    const [revenueData] = await pool.query(
      `SELECT * FROM monthly_revenue WHERE month >= ? ORDER BY month ASC`,
      [startMonth]
    );
    
    // Calculate total metrics for current period
    let totalRevenue = 0;
    let totalSubscriptions = 0;
    let firstMonthRevenue = 0;
    let lastMonthRevenue = 0;
    
    if (revenueData.length > 0) {
      // Sum up all revenue and subscriptions
      revenueData.forEach(month => {
        totalRevenue += parseFloat(month.total_revenue);
        totalSubscriptions = month.subscription_count; // Get the latest count
      });
      
      // Store first and last month revenue for growth calculation
      firstMonthRevenue = parseFloat(revenueData[0].total_revenue);
      lastMonthRevenue = parseFloat(revenueData[revenueData.length - 1].total_revenue);
    }
    
    // Calculate growth rate
    const growthRate = firstMonthRevenue > 0 
      ? ((lastMonthRevenue - firstMonthRevenue) / firstMonthRevenue) * 100 
      : 0;
    
    // Calculate ARPU (Average Revenue Per User)
    const arpu = totalSubscriptions > 0 
      ? (lastMonthRevenue / totalSubscriptions) 
      : 0;
    
    // Get plan distribution data
    const [planDistribution] = await pool.query(
      `SELECT * FROM plan_distribution WHERE month = ? ORDER BY subscriber_count DESC`,
      [currentMonth]
    );
    
    res.status(200).json({
      overview: {
        totalRevenue: totalRevenue.toFixed(2),
        subscriptions: totalSubscriptions,
        growthRate: growthRate.toFixed(1),
        arpu: arpu.toFixed(2),
        revenueGrowth: ((lastMonthRevenue - firstMonthRevenue) / firstMonthRevenue * 100).toFixed(1)
      },
      monthlyRevenue: revenueData.map(item => ({
        month: item.month,
        revenue: parseFloat(item.total_revenue),
        subscriptions: item.subscription_count,
        newCustomers: item.new_customers,
        churnedCustomers: item.churned_customers
      })),
      planDistribution: planDistribution.map(item => ({
        plan: item.plan_name,
        subscribers: item.subscriber_count,
        revenue: parseFloat(item.revenue),
        percentage: parseFloat(item.percentage)
      }))
    });
  } catch (error) {
    console.error('Get sales overview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get detailed revenue data
exports.getRevenueDetails = async (req, res) => {
  try {
    const { period = '12' } = req.query; // Default to last 12 months
    const months = parseInt(period);
    
    // Calculate the previous period for comparison
    const previousDate = new Date();
    previousDate.setMonth(previousDate.getMonth() - months);
    const startMonth = `${previousDate.getFullYear()}-${String(previousDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Get monthly revenue data
    const [revenueData] = await pool.query(
      `SELECT * FROM monthly_revenue WHERE month >= ? ORDER BY month ASC`,
      [startMonth]
    );
    
    res.status(200).json(
      revenueData.map(item => ({
        month: item.month,
        revenue: parseFloat(item.total_revenue),
        subscriptions: item.subscription_count,
        newCustomers: item.new_customers,
        churnedCustomers: item.churned_customers
      }))
    );
  } catch (error) {
    console.error('Get revenue details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get plan distribution data
exports.getPlanDistribution = async (req, res) => {
  try {
    const { month } = req.query; 
    
    // Get current month if not specified
    const currentDate = new Date();
    const currentMonth = month || `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    // Get plan distribution data
    const [planDistribution] = await pool.query(
      `SELECT * FROM plan_distribution WHERE month = ? ORDER BY subscriber_count DESC`,
      [currentMonth]
    );
    
    res.status(200).json(
      planDistribution.map(item => ({
        plan: item.plan_name,
        subscribers: item.subscriber_count,
        revenue: parseFloat(item.revenue),
        percentage: parseFloat(item.percentage)
      }))
    );
  } catch (error) {
    console.error('Get plan distribution error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
