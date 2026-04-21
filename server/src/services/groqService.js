import { getGroqClient } from '../config/groq.js'

// ─── Helper: parse JSON from AI response ──────────────────────────────────────
const parseJSON = (text) => {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/gi, '')
    .trim()
  return JSON.parse(cleaned)
}

// ─── Analyze skills and return 3 career paths ─────────────────────────────────
export const analyzeSkills = async (answers) => {
  const groq = getGroqClient()

  const formatted = answers
    .map(a => `Q: ${a.question}\nA: ${a.answer}`)
    .join('\n\n')

  const prompt = `You are an expert career coach AI. Based on the user's answers below, suggest exactly 3 realistic income paths they can pursue.

Return ONLY a valid JSON array — no explanation, no markdown, no extra text. Use this exact structure:

[
  {
    "title": "Path title",
    "category": "Creative|Tech|Education|Business|Health|Marketing|Design",
    "difficulty": "Beginner|Intermediate|Advanced",
    "incomeRange": "$X–$Y/mo",
    "timeToStart": "X–Y weeks",
    "description": "2-3 sentence description of the path",
    "skillsNeeded": ["skill1", "skill2", "skill3", "skill4"]
  }
]

User answers:
${formatted}

Rules:
- Match the paths to the user's actual skills and time commitment
- Be realistic about income ranges
- Order from best fit to third best fit
- Keep skillsNeeded to 3-5 items maximum
- Return ONLY the JSON array, nothing else`

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
  })

  const text = chatCompletion.choices[0]?.message?.content || ''
  return parseJSON(text)
}

// ─── Generate a 30-day roadmap for a specific path ────────────────────────────
export const generateRoadmap = async (pathTitle, pathDescription, difficulty) => {
  const groq = getGroqClient()

  const stepCount = difficulty === 'Beginner' ? 6 : difficulty === 'Intermediate' ? 8 : 10

  const prompt = `You are an expert career coach. Create a detailed step-by-step 30-day roadmap for someone pursuing this income path:

Title: ${pathTitle}
Description: ${pathDescription}
Difficulty: ${difficulty}

Return ONLY a valid JSON object with this exact structure — no markdown, no explanation:

{
  "totalDays": 30,
  "steps": [
    {
      "stepNumber": 1,
      "title": "Step title",
      "description": "Detailed action description (2-3 sentences, be specific)",
      "estimatedDays": 3,
      "resources": [
        { "title": "Resource name", "url": "https://example.com" }
      ]
    }
  ]
}

Rules:
- Create exactly ${stepCount} steps
- The estimatedDays must add up to approximately 30
- Each step should be specific and actionable, not vague
- Include 1-2 real, relevant resources per step (use real websites like upwork.com, linkedin.com, coursera.org, udemy.com, etc.)
- Steps should build on each other logically
- Return ONLY the JSON object`

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.7,
    max_tokens: 4096,
  })

  const text = chatCompletion.choices[0]?.message?.content || ''
  return parseJSON(text)
}
