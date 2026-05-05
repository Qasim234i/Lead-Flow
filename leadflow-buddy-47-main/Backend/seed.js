const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Lead = require('./models/Lead');
const Note = require('./models/Note');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Lead.deleteMany();
    await Note.deleteMany();
    console.log('Cleared existing data');

    // Create test user
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await User.create({
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
    });
    console.log('Test user created:', user.email);

    // Create sample leads
    const leads = await Lead.insertMany([
      {
        name: 'Alice Johnson',
        company: 'TechCorp Inc.',
        email: 'alice@techcorp.com',
        phone: '+1-555-0101',
        source: 'LinkedIn',
        assignedTo: 'Admin User',
        status: 'New',
        dealValue: 15000,
      },
      {
        name: 'Bob Smith',
        company: 'StartUpXYZ',
        email: 'bob@startupxyz.com',
        phone: '+1-555-0102',
        source: 'Website',
        assignedTo: 'Admin User',
        status: 'Contacted',
        dealValue: 25000,
      },
      {
        name: 'Carol Davis',
        company: 'Global Solutions',
        email: 'carol@globalsolutions.com',
        phone: '+1-555-0103',
        source: 'Referral',
        assignedTo: 'Admin User',
        status: 'Qualified',
        dealValue: 50000,
      },
      {
        name: 'David Wilson',
        company: 'Innovate Labs',
        email: 'david@innovatelabs.com',
        phone: '+1-555-0104',
        source: 'Cold Call',
        assignedTo: 'Admin User',
        status: 'Proposal Sent',
        dealValue: 75000,
      },
      {
        name: 'Eva Martinez',
        company: 'Future Systems',
        email: 'eva@futuresystems.com',
        phone: '+1-555-0105',
        source: 'Email',
        assignedTo: 'Admin User',
        status: 'Won',
        dealValue: 100000,
      },
      {
        name: 'Frank Brown',
        company: 'Old Corp',
        email: 'frank@oldcorp.com',
        phone: '+1-555-0106',
        source: 'Other',
        assignedTo: 'Admin User',
        status: 'Lost',
        dealValue: 30000,
      },
    ]);
    console.log(`${leads.length} sample leads created`);

    // Create sample notes
    const notes = await Note.insertMany([
      {
        leadId: leads[0]._id,
        content: 'Initial contact made via LinkedIn message. Interested in our product.',
        createdBy: 'Admin User',
      },
      {
        leadId: leads[0]._id,
        content: 'Scheduled a demo call for next Tuesday.',
        createdBy: 'Admin User',
      },
      {
        leadId: leads[1]._id,
        content: 'Filled out contact form on website. Requested pricing info.',
        createdBy: 'Admin User',
      },
      {
        leadId: leads[2]._id,
        content: 'Referred by existing client John Doe. High priority lead.',
        createdBy: 'Admin User',
      },
      {
        leadId: leads[3]._id,
        content: 'Proposal sent with custom pricing. Waiting for feedback.',
        createdBy: 'Admin User',
      },
      {
        leadId: leads[4]._id,
        content: 'Deal closed! Contract signed on May 1st.',
        createdBy: 'Admin User',
      },
      {
        leadId: leads[5]._id,
        content: 'Budget constraints. Will revisit in Q3.',
        createdBy: 'Admin User',
      },
    ]);
    console.log(`${notes.length} sample notes created`);

    console.log('\n✅ Seed completed successfully!');
    console.log('\nTest Login Credentials:');
    console.log('Email: admin@example.com');
    console.log('Password: password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
