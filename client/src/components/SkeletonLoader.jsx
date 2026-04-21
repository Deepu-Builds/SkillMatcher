const SkeletonLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="card flex flex-col gap-4 bg-white overflow-hidden"
        >
          {/* Header Section */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              {/* Difficulty Badge */}
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-16 mb-2 animate-pulse" />
              {/* Title */}
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-3/4 mb-2 mt-2 animate-pulse" />
            </div>
            {/* Icon Placeholders */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-200 to-gray-100 animate-pulse" />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-full animate-pulse" />
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-5/6 animate-pulse" />
          </div>

          {/* Info Items */}
          <div className="flex flex-wrap gap-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24 animate-pulse" />
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-28 animate-pulse" />
          </div>

          {/* Skills Tags */}
          <div className="flex flex-wrap gap-1.5">
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-20 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-24 animate-pulse" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg w-16 animate-pulse" />
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-full animate-pulse" />
          </div>

          {/* Button */}
          <div className="mt-auto pt-2">
            <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-100 rounded-lg w-full animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
