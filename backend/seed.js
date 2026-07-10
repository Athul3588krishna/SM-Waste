const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Team = require('./models/Team');
const Announcement = require('./models/Announcement');
const Notification = require('./models/Notification');

// Load environment variables
dotenv.config();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Copy generated assets into uploads folder
const copyAssets = () => {
  const brainDir = 'C:\\Users\\User\\.gemini\\antigravity\\brain\\aa148cd8-7f93-4f99-80e8-8d48c7b614a3';
  const beforeSource = path.join(brainDir, 'waste_before_1783262445645.png');
  const afterSource = path.join(brainDir, 'waste_after_1783262460200.png');

  const beforeDest = path.join(uploadsDir, 'sample_before.png');
  const afterDest = path.join(uploadsDir, 'sample_after.png');

  try {
    if (fs.existsSync(beforeSource)) {
      fs.copyFileSync(beforeSource, beforeDest);
      console.log('Copied waste_before image to uploads.');
    } else {
      fs.writeFileSync(beforeDest, 'placeholder-before-image-content');
      console.log('Created placeholder before image.');
    }

    if (fs.existsSync(afterSource)) {
      fs.copyFileSync(afterSource, afterDest);
      console.log('Copied waste_after image to uploads.');
    } else {
      fs.writeFileSync(afterDest, 'placeholder-after-image-content');
      console.log('Created placeholder after image.');
    }
  } catch (error) {
    console.error('Error copying demo assets:', error.message);
  }
};

const seedData = async () => {
  try {
    // Connect to database
    console.log('Connecting to database...');
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 4000
      });
      console.log('Connected to MongoDB Atlas for seeding.');
    } catch (atlasErr) {
      console.warn(`Atlas connection failed: ${atlasErr.message}. Falling back to Local MongoDB...`);
      await mongoose.connect('mongodb://localhost:27017/smart-waste', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 4000
      });
      console.log('Connected to Local MongoDB for seeding.');
    }

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await Team.deleteMany();
    await Announcement.deleteMany();
    await Notification.deleteMany();
    console.log('Cleared all collections.');

    // Copy assets
    copyAssets();

    // 1. Create Users
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@waste.com',
      password: 'admin123',
      role: 'admin',
    });

    const worker1 = await User.create({
      name: 'Anil Kumar',
      email: 'worker1@waste.com',
      password: 'worker123',
      role: 'worker',
      isOnline: true,
      points: 20, // 2 completed tasks
    });

    const worker2 = await User.create({
      name: 'Suresh Pillai',
      email: 'worker2@waste.com',
      password: 'worker123',
      role: 'worker',
      isOnline: true,
      points: 30, // 3 completed tasks
    });

    const worker3 = await User.create({
      name: 'Maya Sen',
      email: 'worker3@waste.com',
      password: 'worker123',
      role: 'worker',
      isOnline: false, // Starts offline
      points: 0,
    });

    const citizen = await User.create({
      name: 'Adarsh Nair',
      email: 'citizen@waste.com',
      password: 'citizen123',
      role: 'citizen',
      points: 100,
      badge: 'Eco Cadet',
    });

    const citizen2 = await User.create({
      name: 'Anjali Menon',
      email: 'citizen2@waste.com',
      password: 'citizen123',
      role: 'citizen',
      points: 50,
      badge: 'Novice Reporter',
    });

    console.log('Users seeded successfully!');

    // 2. Create Cleaning Teams
    const team1 = await Team.create({
      name: 'Perinthalmanna East Cleaners',
      members: [worker1._id, worker3._id],
    });

    const team2 = await Team.create({
      name: 'Angadipuram Squad',
      members: [worker2._id],
    });

    console.log('Teams seeded successfully!');

    // 3. Create Announcements
    await Announcement.create({
      title: 'Perinthalmanna Green Protocol Active',
      message: 'Perinthalmanna Municipality has activated strict green protocols across all residential blocks. Earn double Eco-Points for reporting plastic waste.',
    });

    await Announcement.create({
      title: 'Sanitation Volunteers Clean Drive',
      message: 'Join the weekend cleanup drive at Perinthalmanna Bypass Road. Meet at Jubilee Junction at 7:00 AM.',
    });

    console.log('Announcements seeded successfully!');

    // 4. Create Complaints
    // Complaint 1: Pending (Perinthalmanna)
    await Complaint.create({
      citizen: citizen._id,
      title: 'Jubilee Junction Garbage Pile',
      description: 'A large pile of plastic waste and food containers discarded near Jubilee Junction. Causing pedestrian obstruction.',
      location: {
        latitude: 10.9752,
        longitude: 76.2238,
        address: 'Jubilee Junction, Kozhikode Road, Perinthalmanna, Malappuram, Kerala',
      },
      wasteType: 'Plastic',
      severity: 'Medium',
      photoBefore: '/uploads/sample_before.png',
      status: 'pending',
    });

    // Complaint 2: Verified & Unassigned (Angadipuram)
    await Complaint.create({
      citizen: citizen2._id,
      title: 'Chemical Cans on Bypass Road Canal',
      description: 'Multiple paint cans and pesticide canisters dumped on the bypass road canal. Needs hazardous disposal.',
      location: {
        latitude: 10.9850,
        longitude: 76.2050,
        address: 'Bypass Road Canal Road, Angadipuram, Perinthalmanna, Malappuram, Kerala',
      },
      wasteType: 'Hazardous',
      severity: 'High',
      photoBefore: '/uploads/sample_before.png',
      status: 'verified',
    });

    // Complaint 3: Assigned to Individual Worker (Manathumangalam) - Active
    await Complaint.create({
      citizen: citizen._id,
      title: 'Rotting Organic Food Waste near Perinthalmanna Market',
      description: 'Market waste dumped behind the bus shelter. Emitting foul smell.',
      location: {
        latitude: 10.9620,
        longitude: 76.2380,
        address: 'Market Road, Manathumangalam, Perinthalmanna, Kerala',
      },
      wasteType: 'Organic',
      severity: 'High',
      photoBefore: '/uploads/sample_before.png',
      status: 'assigned',
      assignedToType: 'individual',
      worker: worker1._id,
      assignedAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      deadlineAt: new Date(Date.now() + 18 * 60 * 60 * 1000), // 1 day total (18h left)
    });

    // Complaint 4: Cleaned by Worker but Pending Admin Verification (Ooty Road)
    await Complaint.create({
      citizen: citizen._id,
      title: 'Cardboard & Paper Scrap Pile',
      description: 'Cardboard boxes, papers, and packing materials piled up in the public playground.',
      location: {
        latitude: 10.9580,
        longitude: 76.2180,
        address: 'Ooty Road, Perinthalmanna, Kerala',
      },
      wasteType: 'Mixed',
      severity: 'Low',
      photoBefore: '/uploads/sample_before.png',
      photoAfter: '/uploads/sample_after.png',
      status: 'cleaned',
      assignedToType: 'team',
      team: team2._id,
      worker: worker2._id, // member of team2 who cleaned it
      assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      deadlineAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 2 days total
      cleanedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // Cleaned 1 hour ago
    });

    // Complaint 5: Fully Completed & Verified with Bonus (Pattambi Road)
    const completedComplaint = await Complaint.create({
      citizen: citizen2._id,
      title: 'Discarded E-Waste pile',
      description: 'Old TVs and computer monitors dumped behind the garbage bin.',
      location: {
        latitude: 10.9820,
        longitude: 76.2420,
        address: 'Pattambi Road, Perinthalmanna, Kerala',
      },
      wasteType: 'E-waste',
      severity: 'Medium',
      photoBefore: '/uploads/sample_before.png',
      photoAfter: '/uploads/sample_after.png',
      status: 'completed',
      assignedToType: 'individual',
      worker: worker2._id,
      assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      deadlineAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      cleanedAt: new Date(Date.now() - 2.1 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      bonusAmount: 150,
    });

    // Add bonus history entry to worker2
    worker2.bonusHistory.push({
      amount: 150,
      complaint: completedComplaint._id,
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });
    await worker2.save();

    console.log('Sample complaints seeded successfully!');
    mongoose.connection.close();
    console.log('DB Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedData();
