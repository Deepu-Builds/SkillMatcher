const ProgressBar = ({ percent = 0, showLabel = false, size = 'md', color = 'orange' }) => {
  const heights = { sm: 'h-1.5', md: 'h-2', lg: 'h-3' }
  const colorMap = {
    orange: 'bg-orange-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
  }

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-1.5">
          <span className="text-xs text-gray-400 font-medium">Progress</span>
          <span className="text-xs text-gray-700 font-semibold">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${heights[size]} overflow-hidden`}>
        <div
          className={`${heights[size]} rounded-full ${colorMap[color]} transition-all duration-500`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
