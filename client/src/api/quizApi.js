import axiosClient from './axiosClient'

export const quizApi = {
  getQuestions: () => axiosClient.get('/quiz/questions'),
  submitAnswers: (answers) => axiosClient.post('/quiz/submit', { answers }),
  getHistory: () => axiosClient.get('/quiz/history'),
}
