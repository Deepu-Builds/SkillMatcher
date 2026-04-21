import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import User from '../models/User.js'
import Path from '../models/Path.js'
import QuizResponse from '../models/QuizResponse.js'

const SEED_USER = {
  name: 'Alex Johnson',
  email: 'alex@demo.com',
  password: 'password123',
}

const SEED_PATHS = [
  {
    title: 'Freelance Content Writer',
    category: 'Creative',
    difficulty: 'Beginner',
    incomeRange: '$800–$2,500/mo',
    timeToStart: '1–2 weeks',
    description: 'Use your natural communication skills to write blog posts, newsletters, and web copy for businesses. High demand, low barrier to entry.',
    skillsNeeded: ['Writing', 'Research', 'SEO basics', 'Pitching'],
    isSaved: true,
    roadmap: {
      totalDays: 30,
      steps: [
        { stepNumber: 1, title: 'Define Your Writing Niche', description: 'Choose 1–2 industries you understand (tech, health, finance). Specialists earn 2–3x more than generalists.', estimatedDays: 2, isCompleted: true, resources: [{ title: 'Niche Selection Guide', url: 'https://www.nichepursuits.com/how-to-find-a-niche/' }] },
        { stepNumber: 2, title: 'Build Your Portfolio (3 Sample Pieces)', description: 'Write 3 unpublished sample articles in your niche. Post them on Medium or a free Notion page as your portfolio.', estimatedDays: 5, isCompleted: true, resources: [{ title: 'Medium.com', url: 'https://medium.com' }, { title: 'Notion Portfolio Template', url: 'https://notion.so' }] },
        { stepNumber: 3, title: 'Set Up Your LinkedIn Profile', description: 'Optimize headline: "Freelance [Niche] Writer". Add portfolio links. Connect with 30 content managers.', estimatedDays: 1, isCompleted: true, resources: [{ title: 'LinkedIn Profile Tips', url: 'https://linkedin.com' }] },
        { stepNumber: 4, title: 'Create Upwork + Fiverr Profiles', description: 'Write a client-facing bio. Set beginner pricing ($30–$60/article). Apply to 5 jobs per day.', estimatedDays: 2, isCompleted: true, resources: [{ title: 'Upwork', url: 'https://upwork.com' }, { title: 'Fiverr', url: 'https://fiverr.com' }] },
        { stepNumber: 5, title: 'Land Your First Client', description: 'Pitch 10 businesses directly via email. Offer a free trial article. Focus on getting one testimonial.', estimatedDays: 5, isCompleted: true, resources: [{ title: 'Cold Email Templates', url: 'https://hunter.io/templates' }] },
        { stepNumber: 6, title: 'Deliver & Get Testimonial', description: 'Over-deliver on your first project. Ask for a written testimonial you can add to your portfolio.', estimatedDays: 3, isCompleted: false, resources: [] },
        { stepNumber: 7, title: 'Raise Rates & Scale', description: 'With 1 testimonial, raise prices to $80–$150/article. Apply to higher-quality clients on ProBlogger and Contena.', estimatedDays: 7, isCompleted: false, resources: [{ title: 'ProBlogger Job Board', url: 'https://problogger.com/jobs' }] },
        { stepNumber: 8, title: 'Build Recurring Revenue', description: 'Pitch a retainer to 1–2 clients (4 articles/month). Recurring contracts stabilize your income month-to-month.', estimatedDays: 5, isCompleted: false, resources: [{ title: 'Retainer Contract Guide', url: 'https://www.and.co/blog/freelance-contracts/retainer-contracts' }] },
      ],
    },
  },
  {
    title: 'UX Consultant',
    category: 'Tech',
    difficulty: 'Intermediate',
    incomeRange: '$2,500–$7,000/mo',
    timeToStart: '2–3 weeks',
    description: 'Help startups improve their digital products through user research and wireframing.',
    skillsNeeded: ['Figma', 'User research', 'Portfolio'],
    isSaved: true,
    roadmap: {
      totalDays: 30,
      steps: [
        { stepNumber: 1, title: 'Master Figma Fundamentals', description: 'Complete Figma\'s free official course. Build 2 practice wireframes for real apps you use.', estimatedDays: 5, isCompleted: true, resources: [{ title: 'Figma Free Course', url: 'https://help.figma.com/hc/en-us/articles/360040514593' }] },
        { stepNumber: 2, title: 'Build a UX Case Study Portfolio', description: 'Document a UX redesign project — before/after, research, decisions. This is your proof of process.', estimatedDays: 7, isCompleted: true, resources: [{ title: 'UX Case Study Guide', url: 'https://uxplanet.org/how-to-write-a-ux-case-study-7b11b5f14d76' }] },
        { stepNumber: 3, title: 'Define Your Service Package', description: 'Create 3 service tiers: UX Audit ($500), Wireframes ($1,500), Full UX Sprint ($3,000+).', estimatedDays: 2, isCompleted: true, resources: [{ title: 'Pricing Your UX Services', url: 'https://uxdesign.cc/how-to-price-your-ux-consulting-services-db4a9e80ee3e' }] },
        { stepNumber: 4, title: 'Reach Out to 10 Startups', description: 'Find early-stage startups on ProductHunt or AngelList. Offer a free 30-min UX audit call.', estimatedDays: 5, isCompleted: false, resources: [{ title: 'ProductHunt', url: 'https://producthunt.com' }, { title: 'AngelList', url: 'https://angel.co' }] },
        { stepNumber: 5, title: 'Land First Paid Project', description: 'Convert one audit into a paid engagement. Aim for $500–$1,500 to start.', estimatedDays: 5, isCompleted: false, resources: [] },
      ],
    },
  },
  {
    title: 'Online Course Creator',
    category: 'Education',
    difficulty: 'Intermediate',
    incomeRange: '$1,500–$8,000/mo',
    timeToStart: '3–4 weeks',
    description: 'Package expertise into structured video courses. Build once, earn repeatedly.',
    skillsNeeded: ['Teaching', 'Video editing', 'Audience building'],
    isSaved: false,
    roadmap: { totalDays: 30, steps: [] },
  },
]

const SEED_QUIZ = {
  answers: [
    { questionId: 'q1', question: 'What are you naturally good at?', answer: 'Writing, storytelling, and explaining complex topics clearly.' },
    { questionId: 'q2', question: 'How many hours per week can you commit?', answer: '10-20 hours' },
    { questionId: 'q3', question: "What's your income goal in the next 6 months?", answer: '$500–$1,500/month' },
    { questionId: 'q4', question: 'What kind of work environment do you prefer?', answer: 'Working solo, Creative work' },
    { questionId: 'q5', question: 'Any specific skills or tools you already know?', answer: 'Google Docs, basic SEO, WordPress' },
  ],
}

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Clear existing seed data
    await User.deleteOne({ email: SEED_USER.email })
    console.log('🗑️  Cleared existing seed user')

    // Create user
    const user = await User.create(SEED_USER)
    console.log(`👤 Created user: ${user.email}`)

    // Create paths
    const paths = await Promise.all(
      SEED_PATHS.map(p => Path.create({ ...p, userId: user._id }))
    )
    console.log(`📋 Created ${paths.length} paths`)

    // Create quiz response
    const quiz = await QuizResponse.create({
      userId: user._id,
      ...SEED_QUIZ,
      generatedPaths: paths.map(p => p._id),
    })
    console.log(`📝 Created quiz response`)

    // Link everything to user
    user.quizHistory = [quiz._id]
    user.savedPaths = paths.filter(p => p.isSaved).map(p => p._id)
    user.skillTags = ['Writing', 'SEO', 'WordPress']
    await user.save()

    console.log('\n✅ Seed complete!')
    console.log('─────────────────────────────')
    console.log(`   Email:    ${SEED_USER.email}`)
    console.log(`   Password: ${SEED_USER.password}`)
    console.log('─────────────────────────────\n')

    process.exit(0)
  } catch (err) {
    console.error('❌ Seed failed:', err.message)
    process.exit(1)
  }
}

seed()
