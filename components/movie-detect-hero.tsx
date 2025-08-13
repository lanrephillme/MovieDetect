import type React from "react"

const MovieDetectHero: React.FC = () => {
  return (
    <div className="bg-black text-center py-16 px-4 sm:px-6 lg:px-8">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
        Find Any Movie with
        <span className="bg-gradient-to-r from-teal-400 to-purple-600 bg-clip-text text-transparent"> AI Magic</span>
      </h1>
      <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
        Describe scenes, upload images, hum soundtracks, or record video clips. Our AI will find exactly what you're
        looking for.
      </p>
      {/* Additional components or code can be added here */}
    </div>
  )
}

export default MovieDetectHero
