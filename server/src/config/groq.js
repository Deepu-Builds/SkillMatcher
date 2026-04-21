import Groq from 'groq-sdk'

let groqClient = null

export const getGroqClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not set in environment variables')
  }
  if (!groqClient) {
    groqClient = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    })
  }
  return groqClient
}

export default getGroqClient
