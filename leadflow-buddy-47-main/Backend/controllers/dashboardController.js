const Lead = require('../models/Lead');

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    // Count leads by status
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const qualifiedLeads = await Lead.countDocuments({ status: 'Qualified' });
    const wonLeads = await Lead.countDocuments({ status: 'Won' });
    const lostLeads = await Lead.countDocuments({ status: 'Lost' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const proposalSentLeads = await Lead.countDocuments({ status: 'Proposal Sent' });

    // Sum deal values
    const totalDealValueResult = await Lead.aggregate([
      { $group: { _id: null, total: { $sum: '$dealValue' } } },
    ]);
    const totalDealValue = totalDealValueResult[0]?.total || 0;

    // Sum won deal values
    const wonDealValueResult = await Lead.aggregate([
      { $match: { status: 'Won' } },
      { $group: { _id: null, total: { $sum: '$dealValue' } } },
    ]);
    const wonDealValue = wonDealValueResult[0]?.total || 0;

    // Sum lost deal values
    const lostDealValueResult = await Lead.aggregate([
      { $match: { status: 'Lost' } },
      { $group: { _id: null, total: { $sum: '$dealValue' } } },
    ]);
    const lostDealValue = lostDealValueResult[0]?.total || 0;

    // Recent leads (last 5)
    const recentLeads = await Lead.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name company status dealValue createdAt');

    res.status(200).json({
      success: true,
      data: {
        counts: {
          totalLeads,
          newLeads,
          contactedLeads,
          qualifiedLeads,
          proposalSentLeads,
          wonLeads,
          lostLeads,
        },
        revenue: {
          totalDealValue,
          wonDealValue,
          lostDealValue,
        },
        recentLeads,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
