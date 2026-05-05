const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Lead = require('../models/Lead');
const Note = require('../models/Note');

const seedDatabase = async () => {
  try {
    // Check if test user exists
    const existingUser = await User.findOne({ email: 'admin@example.com' });

    if (!existingUser) {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User'
      });
      console.log('Test user created: admin@example.com / password123');

      // Create sample leads
      const leads = await Lead.insertMany([
        {
          name: 'John Smith',
          company: 'Acme Corp',
          email: 'john@acme.com',
          phone: '+1-555-0101',
          source: 'LinkedIn',
          assignedTo: 'Admin User',
          status: 'Qualified',
          dealValue: 15000
        },
        {
          name: 'Sarah Johnson',
          company: 'TechStart Inc',
          email: 'sarah@techstart.com',
          phone: '+1-555-0102',
          source: 'Website',
          assignedTo: 'Admin User',
          status: 'Proposal Sent',
          dealValue: 25000
        },
        {
          name: 'Michael Chen',
          company: 'Global Solutions',
          email: 'michael@globalsol.com',
          phone: '+1-555-0103',
          source: 'Referral',
          assignedTo: 'Admin User',
          status: 'New',
          dealValue: 10000
        },
        {
          name: 'Emily Davis',
          company: 'Innovate Labs',
          email: 'emily@innovate.com',
          phone: '+1-555-0104',
          source: 'Cold Call',
          assignedTo: 'Admin User',
          status: 'Won',
          dealValue: 35000
        },
        {
          name: 'Robert Wilson',
          company: 'DataFlow Systems',
          email: 'robert@dataflow.com',
          phone: '+1-555-0105',
          source: 'Email Campaign',
          assignedTo: 'Admin User',
          status: 'Lost',
          dealValue: 8000
        },
        {
          name: 'Lisa Anderson',
          company: 'Cloud Nine Tech',
          email: 'lisa@cloudnine.com',
          phone: '+1-555-0106',
          source: 'LinkedIn',
          assignedTo: 'Admin User',
          status: 'Contacted',
          dealValue: 20000
        }
      ]);

      console.log(`${leads.length} sample leads created`);

      // Create sample notes
      const notes = await Note.insertMany([
        {
          leadId: leads[0]._id,
          content: 'Initial contact made. Interested in our enterprise plan.',
          createdBy: 'Admin User'
        },
        {
          leadId: leads[0]._id,
          content: 'Follow-up call scheduled for next week.',
          createdBy: 'Admin User'
        },
        {
          leadId: leads[1]._id,
          content: 'Sent proposal document. Waiting for feedback.',
          createdBy: 'Admin User'
        },
        {
          leadId: leads[3]._id,
          content: 'Deal closed! Contract signed.',
          createdBy: 'Admin User'
        }
      ]);

      console.log(`${notes.length} sample notes created`);
    } else {
      console.log('Test user already exists. Skipping seed.');
    }
  } catch (error) {
    console.error('Seed error:', error.message);
  }
};

module.exports = seedDatabase;
