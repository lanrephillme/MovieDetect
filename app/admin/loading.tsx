export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-teal-900/10" />

      <div className="relative">
        {/* Navigation Skeleton */}
        <nav className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg animate-pulse" />
            <div className="w-48 h-6 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="w-24 h-8 bg-gray-800 rounded animate-pulse" />
        </nav>

        {/* Tab Navigation Skeleton */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-24 h-10 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-6 animate-pulse">
                  <div className="w-8 h-8 bg-gray-700 rounded mx-auto mb-2" />
                  <div className="w-16 h-6 bg-gray-700 rounded mx-auto mb-1" />
                  <div className="w-20 h-4 bg-gray-700 rounded mx-auto" />
                </div>
              ))}
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg animate-pulse">
                  <div className="p-6 border-b border-gray-700">
                    <div className="w-32 h-6 bg-gray-700 rounded mb-2" />
                    <div className="w-48 h-4 bg-gray-700 rounded" />
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <div key={j} className="flex items-center justify-between">
                          <div>
                            <div className="w-32 h-4 bg-gray-700 rounded mb-1" />
                            <div className="w-24 h-3 bg-gray-700 rounded" />
                          </div>
                          <div className="w-16 h-6 bg-gray-700 rounded" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
