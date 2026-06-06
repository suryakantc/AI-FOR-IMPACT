require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./Complaint');

const SEED_DATA = [
  {
    ticketId: 'TK-2026-10001',
    rawText: 'Hostel ke room 204 me fan 3 din se kharab hai',
    language: 'Hindi-English',
    issueType: 'Electrical',
    department: 'Hostel Maintenance',
    location: 'Hostel Room 204',
    duration: '3 days',
    urgency: 82,
    summary: 'Ceiling fan not working for three days in hostel room 204',
    formalComplaint: 'I wish to report that the ceiling fan in Hostel Room 204 has been non-functional for the past three days. The room becomes extremely uncomfortable, especially during nighttime. Kindly arrange for immediate repair.',
    status: 'IN PROGRESS'
  },
  {
    ticketId: 'TK-2026-10002',
    rawText: 'Mess me khana bahut kharab mil raha hai, aaj dal me keeda mila',
    language: 'Hindi-English',
    issueType: 'Mess',
    department: 'Mess Committee',
    location: 'Main Mess Hall',
    duration: 'Ongoing',
    urgency: 93,
    summary: 'Insect found in dal served at mess, food quality severely poor',
    formalComplaint: 'I am writing to report a serious food hygiene issue at the Main Mess Hall. An insect was found in the dal served today. The overall food quality has been consistently poor. This poses a significant health risk to all students and requires immediate investigation.',
    status: 'OPEN'
  },
  {
    ticketId: 'TK-2026-10003',
    rawText: 'Library me AC nahi chal raha, bahut garmi hai padhne me dikkat ho rahi hai',
    language: 'Hindi-English',
    issueType: 'Library',
    department: 'Library Administration',
    location: 'Central Library',
    duration: 'Not specified',
    urgency: 65,
    summary: 'Air conditioning not working in library making it difficult to study',
    formalComplaint: 'The air conditioning system in the Central Library is currently non-functional, resulting in extremely uncomfortable conditions. Students are finding it difficult to concentrate on their studies. Please arrange for the AC to be repaired at the earliest.',
    status: 'OPEN'
  },
  {
    ticketId: 'TK-2026-10004',
    rawText: 'Boys hostel floor 3 pe bathroom ka flush 1 week se tuta hai, paani beh raha hai',
    language: 'Hindi-English',
    issueType: 'Plumbing',
    department: 'Hostel Maintenance',
    location: 'Boys Hostel Floor 3 Bathroom',
    duration: '1 week',
    urgency: 88,
    summary: 'Bathroom flush broken for one week causing water leakage on third floor',
    formalComplaint: 'I wish to report that the flush in the third-floor bathroom of the Boys Hostel has been broken for over a week, causing continuous water leakage. This is leading to water wastage and unsanitary conditions. Urgent repair is required.',
    status: 'OPEN'
  },
  {
    ticketId: 'TK-2026-10005',
    rawText: 'WiFi bohot slow hai hostel me, online class attend nahi ho rahi',
    language: 'Hindi-English',
    issueType: 'Internet',
    department: 'IT Support',
    location: 'Hostel Block A',
    duration: 'Ongoing',
    urgency: 75,
    summary: 'WiFi extremely slow in hostel preventing online class attendance',
    formalComplaint: 'The WiFi connectivity in Hostel Block A has been extremely poor. Students are unable to attend online classes or submit assignments on time. This is severely impacting academic performance. Please upgrade the network infrastructure immediately.',
    status: 'IN PROGRESS'
  },
  {
    ticketId: 'TK-2026-10006',
    rawText: 'Lab me 5 computers kharab hain, practical karne me problem ho rahi hai',
    language: 'Hindi-English',
    issueType: 'Academic',
    department: 'IT Support',
    location: 'Computer Lab 2',
    duration: '2 weeks',
    urgency: 70,
    summary: 'Five computers non-functional in lab affecting practical sessions',
    formalComplaint: 'Five computers in Computer Lab 2 have been non-functional for approximately two weeks. This is causing significant delays in practical sessions as students have to share the remaining systems. Kindly arrange for repair or replacement at the earliest.',
    status: 'RESOLVED'
  },
  {
    ticketId: 'TK-2026-10007',
    rawText: 'Girls hostel ke gate ka lock tuta hai, security concern hai',
    language: 'Hindi-English',
    issueType: 'Hostel',
    department: 'Hostel Security',
    location: 'Girls Hostel Main Gate',
    duration: '2 days',
    urgency: 95,
    summary: 'Broken lock on girls hostel main gate posing security risk',
    formalComplaint: 'I am reporting a critical security concern regarding the Girls Hostel main gate lock, which has been broken for two days. This compromises the safety and security of all resident students. Immediate replacement of the lock is essential.',
    status: 'IN PROGRESS'
  },
  {
    ticketId: 'TK-2026-10008',
    rawText: 'Classroom 301 me projector kaam nahi kar raha, presentation de nahi pa rahe',
    language: 'Hindi-English',
    issueType: 'Academic',
    department: 'Academic Administration',
    location: 'Classroom 301',
    duration: '3 days',
    urgency: 62,
    summary: 'Projector malfunctioning in Classroom 301 disrupting presentations',
    formalComplaint: 'The projector in Classroom 301 has not been working for the past three days. Students are unable to deliver scheduled presentations, which is affecting their academic assessments. Please arrange for a technician to fix or replace the projector.',
    status: 'OPEN'
  },
  {
    ticketId: 'TK-2026-10009',
    rawText: 'Parking area me lights band hain, raat ko bahut andhera rehta hai',
    language: 'Hindi-English',
    issueType: 'Electrical',
    department: 'Campus Maintenance',
    location: 'Main Parking Area',
    duration: '5 days',
    urgency: 78,
    summary: 'Parking area lights not working for five days creating safety hazard at night',
    formalComplaint: 'The lights in the main parking area have been non-functional for the past five days. This creates a significant safety hazard for students and staff during evening and nighttime hours. Kindly restore the lighting at the earliest to prevent any incidents.',
    status: 'RESOLVED'
  },
  {
    ticketId: 'TK-2026-10010',
    rawText: 'Hostel me washing machine 10 din se band hai, kapde dhone ka koi arrangement nahi',
    language: 'Hindi-English',
    issueType: 'Hostel',
    department: 'Hostel Maintenance',
    location: 'Hostel Laundry Room',
    duration: '10 days',
    urgency: 68,
    summary: 'Washing machine broken for ten days with no laundry alternative',
    formalComplaint: 'The washing machine in the hostel laundry room has been out of service for ten days. No alternative laundry arrangement has been provided, causing considerable inconvenience to residents. Please repair or replace the machine urgently.',
    status: 'OPEN'
  },
  {
    ticketId: 'TK-2026-10011',
    rawText: 'Sports ground ka grass bahut badh gaya hai, khelne me dikkat ho rahi hai',
    language: 'Hindi-English',
    issueType: 'Administrative',
    department: 'Campus Maintenance',
    location: 'Sports Ground',
    duration: 'Ongoing',
    urgency: 35,
    summary: 'Sports ground grass overgrown making it unsuitable for games',
    formalComplaint: 'The grass on the campus sports ground has become significantly overgrown, making it unsuitable for any sporting activities. Students are unable to practice for upcoming inter-college tournaments. Please arrange for grounds maintenance at your earliest convenience.',
    status: 'RESOLVED'
  },
  {
    ticketId: 'TK-2026-10012',
    rawText: 'Canteen me pani ka cooler kharab hai, garmi me thanda paani nahi mil raha',
    language: 'Hindi-English',
    issueType: 'Administrative',
    department: 'General Maintenance',
    location: 'Main Canteen',
    duration: '4 days',
    urgency: 72,
    summary: 'Water cooler broken in canteen, no cold drinking water available',
    formalComplaint: 'The water cooler in the main canteen has been out of order for four days. In the current hot weather, students are unable to access cold drinking water, which is a basic necessity. Kindly arrange for immediate repair of the cooler.',
    status: 'OPEN'
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Complaint.deleteMany({});
    console.log('Cleared existing complaints');

    await Complaint.insertMany(SEED_DATA);
    console.log(`Inserted ${SEED_DATA.length} seed complaints`);

    await mongoose.disconnect();
    console.log('Done. Disconnected.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
