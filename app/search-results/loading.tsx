export default function SearchResultsLoading() {
  return (
    <div className="min-h-screen bg-black">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900/10 via-black to-emerald-900/10" />

      <div className="relative">
        {/* Navigation Skeleton */}
        <nav className="flex items-center justify-between p-6 backdrop-blur-md bg-black/30">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-800 rounded-lg animate-pulse" />
            <div className="w-32 h-6 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="w-24 h-6 bg-gray-800 rounded animate-pulse" />
        </nav>

        {/* Header Skeleton */}
        <div className="px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="w-64 h-10 bg-gray-800 rounded animate-pulse mb-2" />
                <div className="w-48 h-5 bg-gray-800 rounded animate-pulse" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-10 h-8 bg-gray-800 rounded animate-pulse" />
                <div className="w-10 h-8 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="px-6 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-800 rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
                <div className="w-32 h-10 bg-gray-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Grid Skeleton */}
        <div className="px-6 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg animate-pulse">
                  <div className="h-64 bg-gray-700 rounded-t-lg" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="flex space-x-1">
                      <div className="h-5 bg-gray-700 rounded w-12" />
                      <div className="h-5 bg-gray-700 rounded w-16" />
                    </div>
                    <div className="h-3 bg-gray-700 rounded w-2/3" />
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
