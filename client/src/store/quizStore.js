import { create } from 'zustand'

export const useQuizStore = create((set, get) => ({
  currentStep: 0,
  answers: [],
  isSubmitting: false,
  results: null,
  error: null,

  setAnswer: (questionId, question, answer) => {
    const existing = get().answers.findIndex((a) => a.questionId === questionId)
    if (existing >= 0) {
      const updated = [...get().answers]
      updated[existing] = { questionId, question, answer }
      set({ answers: updated })
    } else {
      set({ answers: [...get().answers, { questionId, question, answer }] })
    }
  },

  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  setStep: (step) => set({ currentStep: step }),

  setSubmitting: (val) => set({ isSubmitting: val }),

  setResults: (results) => set({ results }),

  setError: (error) => set({ error }),

  reset: () => set({ currentStep: 0, answers: [], isSubmitting: false, results: null, error: null }),
}))
