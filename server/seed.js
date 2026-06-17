const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');
const Message = require('./models/Message');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  try {
    // Check if data already exists
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('📦 Database already has data, skipping seed');
      return;
    }

    console.log('🌱 Seeding database...');

    // Pre-hash password for bulk insert (bypasses mongoose pre-save hook)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Create demo client using .create() to trigger hooks
    const client = await User.create({
      name: 'Demo Client',
      email: 'client@demo.com',
      password: 'password123',
      role: 'client'
    });

    // Create engineers one by one to trigger pre-save hooks
    const engineerData = [
      {
        name: 'Rajesh Verma',
        email: 'rajesh@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Civil Engineer',
        experience: '8 years',
        bio: 'Expert in infrastructure development and urban planning. Managed over 20 large-scale construction projects.',
        skills: ['AutoCAD', 'Structural Analysis', 'Project Management', 'BIM'],
        ratings: 4.5,
        profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified', 'Top Performer']
      },
      {
        name: 'Anita Gupta',
        email: 'anita@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Civil Engineer',
        experience: '5 years',
        bio: 'Specializes in sustainable construction and green buildings. LEED certified professional.',
        skills: ['Sustainable Design', 'Green Building', 'LEED', 'Environmental Engineering'],
        ratings: 4.2,
        profilePicture: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified']
      },
      {
        name: 'Priya Patel',
        email: 'priya@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Mechanical Engineer',
        experience: '7 years',
        bio: 'Experienced in HVAC systems and machinery design. Expert in thermal analysis and fluid dynamics.',
        skills: ['HVAC', 'SolidWorks', 'Thermal Analysis', 'Fluid Dynamics'],
        ratings: 4.7,
        profilePicture: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified', 'Expert']
      },
      {
        name: 'Neha Joshi',
        email: 'neha@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Software Engineer',
        experience: '5 years',
        bio: 'Full-stack developer specializing in cloud computing and microservices architecture.',
        skills: ['JavaScript', 'Python', 'AWS', 'Docker', 'React'],
        ratings: 4.8,
        profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified', 'Top Performer', 'Rising Star']
      },
      {
        name: 'Kunal Sharma',
        email: 'kunal@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Systems Engineer',
        experience: '7 years',
        bio: 'Specializes in systems integration and project management. Experienced in enterprise solutions.',
        skills: ['Systems Integration', 'Project Management', 'Agile', 'DevOps'],
        ratings: 4.6,
        profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified']
      },
      {
        name: 'Amit Patel',
        email: 'amit@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Electrical Engineer',
        experience: '6 years',
        bio: 'Power systems expert with experience in renewable energy integration and smart grid technology.',
        skills: ['Power Systems', 'Renewable Energy', 'Smart Grid', 'MATLAB'],
        ratings: 4.4,
        profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified']
      },
      {
        name: 'Kavitha Reddy',
        email: 'kavitha@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Aerospace Engineer',
        experience: '9 years',
        bio: 'Aerospace propulsion specialist with research in hypersonic flight dynamics.',
        skills: ['Propulsion', 'CFD', 'ANSYS', 'Flight Dynamics'],
        ratings: 4.9,
        profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified', 'Expert', 'Top Performer']
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@demo.com',
        password: 'password123',
        role: 'engineer',
        specialization: 'Data Engineer',
        experience: '4 years',
        bio: 'Big data specialist experienced in building scalable data pipelines and ML infrastructure.',
        skills: ['Apache Spark', 'Kafka', 'Python', 'SQL', 'Airflow'],
        ratings: 4.3,
        profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
        badges: ['Verified']
      }
    ];

    // Create engineers one by one (triggers pre-save password hashing)
    const engineers = [];
    for (const data of engineerData) {
      const eng = await User.create(data);
      engineers.push(eng);
    }

    // Create a demo project
    const project = await Project.create({
      title: 'Smart Office Building — Hyderabad',
      description: 'Design and build a modern smart office complex with integrated IoT systems, sustainable energy solutions, and smart HVAC. The building should accommodate 500+ employees with collaborative workspaces.',
      client: client._id,
      disciplines: ['Civil', 'Electrical', 'Mechanical', 'Software'],
      budget: 250000,
      startDate: new Date('2026-07-01'),
      deadline: new Date('2027-03-31'),
      status: 'in-progress',
      assignedEngineers: [engineers[0]._id, engineers[5]._id, engineers[2]._id]
    });

    // Create tasks for the project
    await Task.insertMany([
      {
        title: 'Complete structural analysis',
        project: project._id,
        assignedTo: engineers[0]._id,
        status: 'inProgress',
        dueDate: new Date('2026-08-15'),
        description: 'Perform full structural analysis for the 12-story building'
      },
      {
        title: 'Design electrical layout',
        project: project._id,
        assignedTo: engineers[5]._id,
        status: 'todo',
        dueDate: new Date('2026-09-01'),
        description: 'Design the complete electrical wiring and power distribution'
      },
      {
        title: 'HVAC system planning',
        project: project._id,
        assignedTo: engineers[2]._id,
        status: 'todo',
        dueDate: new Date('2026-09-15'),
        description: 'Plan the HVAC system for energy-efficient climate control'
      },
      {
        title: 'Foundation design review',
        project: project._id,
        assignedTo: engineers[0]._id,
        status: 'completed',
        dueDate: new Date('2026-07-15'),
        description: 'Review and approve the foundation design documents'
      },
      {
        title: 'IoT sensor placement plan',
        project: project._id,
        assignedTo: engineers[5]._id,
        status: 'todo',
        dueDate: new Date('2026-10-01'),
        description: 'Plan IoT sensor placement for smart building automation'
      }
    ]);

    // Create some messages
    await Message.insertMany([
      {
        sender: engineers[0]._id,
        project: project._id,
        content: 'I\'ve completed the initial site survey. Soil analysis results look promising for the foundation design.',
        createdAt: new Date(Date.now() - 3600000 * 24)
      },
      {
        sender: engineers[5]._id,
        project: project._id,
        content: 'Great news! I\'ll start planning the electrical infrastructure based on the building layout.',
        createdAt: new Date(Date.now() - 3600000 * 12)
      },
      {
        sender: client._id,
        project: project._id,
        content: 'Thanks team! Please make sure we incorporate solar panels on the rooftop. Budget has been updated.',
        createdAt: new Date(Date.now() - 3600000 * 2)
      }
    ]);

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('📋 Demo Accounts:');
    console.log('   Client:   client@demo.com / password123');
    console.log('   Engineer: rajesh@demo.com / password123');
    console.log('   Engineer: neha@demo.com / password123');
    console.log('');
  } catch (error) {
    console.error('❌ Seed error:', error);
  }
};

module.exports = seedData;
