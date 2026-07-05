const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const User = require('./models/User');
const Complaint = require('./models/Complaint');

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
      // Fallback placeholder file
      fs.writeFileSync(beforeDest, 'placeholder-before-image-content');
      console.log('Created placeholder before image.');
    }

    if (fs.existsSync(afterSource)) {
      fs.copyFileSync(afterSource, afterDest);
      console.log('Copied waste_after image to uploads.');
    } else {
      // Fallback placeholder file
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
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/smart-waste', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    console.log('Cleared existing Users and Complaints.');

    // Copy image assets
    copyAssets();

    // 1. Create Users
    const admin = await User.create({
      name: 'Radhakrishnan Nair',
      email: 'admin@waste.com',
      password: 'admin123',
      role: 'admin',
    });

    const worker1 = await User.create({
      name: 'Anil Kumar',
      email: 'worker1@waste.com',
      password: 'worker123',
      role: 'worker',
      points: 40, // 4 tasks completed before
    });

    const worker2 = await User.create({
      name: 'Suresh Pillai',
      email: 'worker2@waste.com',
      password: 'worker123',
      role: 'worker',
      points: 20,
    });

    const citizen = await User.create({
      name: 'Adarsh Nair',
      email: 'citizen@waste.com',
      password: 'citizen123',
      role: 'citizen',
      points: 150,
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

    // 2. Create Complaints (around Kochi, Kerala)
    // Pending
    await Complaint.create({
      citizen: citizen._id,
      title: 'Plastic Pile near Metro Pillar 45',
      description: 'A large pile of plastic waste and food containers discarded near the metro station. Need immediate cleanup.',
      location: {
        latitude: 9.9816,
        longitude: 76.2999,
        address: 'Kochi Metro Pillar 45, Ernakulam, Kerala',
      },
      wasteType: 'Plastic',
      severity: 'Medium',
      photoBefore: '/uploads/sample_before.png',
      status: 'pending',
    });

    // Verified but unassigned
    await Complaint.create({
      citizen: citizen2._id,
      title: 'Hazardous Waste Dump on Canal Bank',
      description: 'Multiple paint cans and chemical waste canisters dumped on the river bank. Extremely hazardous.',
      location: {
        latitude: 10.1076,
        longitude: 76.3458,
        address: 'Periyar River Canal Road, Aluva, Kerala',
      },
      wasteType: 'Hazardous',
      severity: 'High',
      photoBefore: '/uploads/sample_before.png',
      status: 'verified',
    });

    // Assigned to worker1
    await Complaint.create({
      citizen: citizen._id,
      title: 'Organic Food Waste Accumulation',
      description: 'Rotting organic food waste from nearby market dumped behind the bus shelter. Foul smell and flies.',
      location: {
        latitude: 10.0159,
        longitude: 76.3419,
        address: 'Civil Line Road, Kakkanad, Kerala',
      },
      wasteType: 'Organic',
      severity: 'High',
      photoBefore: '/uploads/sample_before.png',
      status: 'assigned',
      worker: worker1._id,
      assignedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    });

    // Completed by worker2
    await Complaint.create({
      citizen: citizen._id,
      title: 'General Trash Dump on Playground Corner',
      description: 'Cardboard boxes, papers and bags piled up at the corner of the public kids playground.',
      location: {
        latitude: 9.9514,
        longitude: 76.3496,
        address: 'Hill Palace Road, Tripunithura, Kerala',
      },
      wasteType: 'Mixed',
      severity: 'Low',
      photoBefore: '/uploads/sample_before.png',
      photoAfter: '/uploads/sample_after.png',
      status: 'completed',
      worker: worker2._id,
      assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
    });

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
