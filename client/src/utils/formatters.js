export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner': return 'badge-beginner'
    case 'intermediate': return 'badge-intermediate'
    case 'advanced': return 'badge-advanced'
    default: return 'badge bg-gray-100 text-gray-600'
  }
}

export const getProgressColor = (percent) => {
  if (percent >= 80) return 'bg-green-500'
  if (percent >= 50) return 'bg-orange-500'
  return 'bg-orange-300'
}

export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

export const calculateProgress = (steps = []) => {
  if (!steps.length) return 0
  const completed = steps.filter((s) => s.isCompleted).length
  return Math.round((completed / steps.length) * 100)
}
