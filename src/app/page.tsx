// Homepage with DEMO DATA - Works without Supabase!

import PrintCard from '@/components/PrintCard'

// Mock data (this is what real data from Supabase would look like)
const mockPrints = [
  {
    id: '1',
    title: 'Benchy the Benchmark Boat',
    description: 'Classic 3D printing test model. Perfect first print!',
    preview_image_url: 'https://via.placeholder.com/400x400/4F46E5/FFFFFF?text=Benchy+Boat',
    upvote_count: 142,
    view_count: 1205,
    comment_count: 23,
    category_name: 'Functional Parts',
    category_slug: 'functional',
    username: 'maker_dave',
    display_name: 'Dave the Maker',
    avatar_url: 'https://via.placeholder.com/40/10B981/FFFFFF?text=D',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Dragon Miniature',
    description: 'Highly detailed fantasy dragon for tabletop gaming. Printed in resin.',
    preview_image_url: 'https://via.placeholder.com/400x400/EC4899/FFFFFF?text=Dragon',
    upvote_count: 89,
    view_count: 654,
    comment_count: 12,
    category_name: 'Miniatures & Figures',
    category_slug: 'miniatures',
    username: 'resin_queen',
    display_name: 'Sarah R.',
    avatar_url: 'https://via.placeholder.com/40/EC4899/FFFFFF?text=S',
    created_at: '2024-01-14T15:20:00Z'
  },
  {
    id: '3',
    title: 'Articulated Octopus',
    description: 'Flexi print that moves! No supports needed.',
    preview_image_url: 'https://via.placeholder.com/400x400/F59E0B/FFFFFF?text=Octopus',
    upvote_count: 215,
    view_count: 2103,
    comment_count: 45,
    category_name: 'Toys & Games',
    category_slug: 'toys',
    username: 'flexi_fan',
    display_name: 'Alex M.',
    avatar_url: 'https://via.placeholder.com/40/F59E0B/FFFFFF?text=A',
    created_at: '2024-01-13T09:45:00Z'
  },
  {
    id: '4',
    title: 'Phone Stand',
    description: 'Simple and elegant phone stand. Print in any color!',
    preview_image_url: 'https://via.placeholder.com/400x400/06B6D4/FFFFFF?text=Phone+Stand',
    upvote_count: 67,
    view_count: 432,
    comment_count: 8,
    category_name: 'Functional Parts',
    category_slug: 'functional',
    username: 'maker_dave',
    display_name: 'Dave the Maker',
    avatar_url: 'https://via.placeholder.com/40/10B981/FFFFFF?text=D',
    created_at: '2024-01-12T14:15:00Z'
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            🎨 3D Print Showcase
          </h1>
          <div className="flex gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
              Browse
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
              Upload
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Demo Notice */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="text-4xl">🎨</div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-2">
                DEMO MODE - No Supabase Required!
              </h2>
              <p className="text-blue-100 mb-4">
                This is showing <strong>mock data</strong> to demonstrate the UI.
                Everything you see works without Supabase!
              </p>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span>Beautiful UI</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span>Components Working</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">❌</span>
                  <span>No Real Data (yet)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Latest Prints
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Discover amazing 3D prints from the community
          </p>

          {/* Quick Stats */}
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="text-sm text-gray-600">Sample Prints</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">513</div>
              <div className="text-sm text-gray-600">Total Upvotes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">88</div>
              <div className="text-sm text-gray-600">Comments</div>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {mockPrints.map((print) => (
            <PrintCard key={print.id} print={print} />
          ))}
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* What Works */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-2xl font-bold mb-4 text-green-600">
              ✅ What's Working (No Supabase Needed)
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">🎨</span>
                <div>
                  <strong>Beautiful UI</strong>
                  <p className="text-sm text-gray-600">Tailwind CSS, responsive design, modern layout</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🧩</span>
                <div>
                  <strong>Components</strong>
                  <p className="text-sm text-gray-600">PrintCard rendering with all data fields</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🔗</span>
                <div>
                  <strong>Navigation</strong>
                  <p className="text-sm text-gray-600">Links and buttons (no backend yet)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📱</span>
                <div>
                  <strong>Responsive</strong>
                  <p className="text-sm text-gray-600">Works on mobile, tablet, desktop</p>
                </div>
              </div>
            </div>
          </div>

          {/* What Needs Supabase */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-2xl font-bold mb-4 text-orange-600">
              🔧 What Needs Supabase
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <strong>Real Data</strong>
                  <p className="text-sm text-gray-600">Currently hardcoded mock data</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📤</span>
                <div>
                  <strong>Upload Prints</strong>
                  <p className="text-sm text-gray-600">Need storage for 3D files & images</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">⬆️</span>
                <div>
                  <strong>Upvotes & Comments</strong>
                  <p className="text-sm text-gray-600">Need database to save interactions</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">👤</span>
                <div>
                  <strong>User Accounts</strong>
                  <p className="text-sm text-gray-600">Login, profiles, authentication</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Make It Real?</h3>
          <p className="text-xl text-blue-100 mb-6">
            Set up Supabase in 10 minutes to unlock all features
          </p>
          <div className="flex gap-4 justify-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">10 min</div>
              <div className="text-sm">Setup Time</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">$0</div>
              <div className="text-sm">Free Tier</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm">Functional</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
