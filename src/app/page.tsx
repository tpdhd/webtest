export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            3D Print Showcase
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover, share, and celebrate amazing 3D prints
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              Browse Gallery
            </button>
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 font-semibold">
              Upload Print
            </button>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold mb-2">Showcase Your Work</h3>
            <p className="text-gray-600">
              Upload and share your 3D prints with the community
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">👁️</div>
            <h3 className="text-xl font-semibold mb-2">Interactive Viewer</h3>
            <p className="text-gray-600">
              Rotate and zoom 3D models in your browser
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm">
            <div className="text-4xl mb-4">⭐</div>
            <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
            <p className="text-gray-600">
              Upvote, comment, and discover the best prints
            </p>
          </div>
        </div>

        <div className="mt-12 p-8 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-center mb-4">
            ✅ Next.js Project Created Successfully!
          </h2>
          <p className="text-center text-gray-700 mb-4">
            Now let's install dependencies and set up Supabase...
          </p>
        </div>
      </div>
    </div>
  )
}
