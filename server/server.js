import dotenv from 'dotenv'
dotenv.config()

import app from './src/app.js'
import connectDB from './src/config/db.js'

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 SkillMatcher API running on port ${PORT}`)
    console.log(`   Mode: ${process.env.NODE_ENV || 'development'}`)
    console.log(`   URL:  http://localhost:${PORT}/api\n`)
  })
}).catch((err) => {
  console.error('❌ Failed to connect to MongoDB:', err.message)
  process.exit(1)
})
