const QuizStep = ({ question, value, onChange }) => {
  if (!question) return null

  const handleMultiSelect = (option) => {
    const current = value ? value.split(', ').filter(Boolean) : []
    const updated = current.includes(option)
      ? current.filter((v) => v !== option)
      : [...current, option]
    onChange(updated.join(', '))
  }

  const selectedMulti = value ? value.split(', ').filter(Boolean) : []

  return (
    <div className="space-y-4">
      {question.type === 'textarea' && (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={question.placeholder}
          className="input-field resize-none"
        />
      )}

      {question.type === 'select' && (
        <div className="space-y-2.5">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onChange(option)}
              className={`w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm font-medium transition-all duration-200
                ${value === option
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50/50'
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {question.type === 'multiselect' && (
        <div className="grid grid-cols-2 gap-2.5">
          {question.options.map((option) => {
            const selected = selectedMulti.includes(option)
            return (
              <button
                key={option}
                onClick={() => handleMultiSelect(option)}
                className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all duration-200
                  ${selected
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50/50'
                  }`}
              >
                {option}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default QuizStep
