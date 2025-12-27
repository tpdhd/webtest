// DEMO PAGE - Works without Supabase!
// Shows how the app will look with mock data

import PrintCard from '@/components/PrintCard'

// Mock data (pretend this came from database)
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
]

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-2">
              🎨 DEMO MODE - No Supabase Required!
            </h1>
            <p className="text-blue-700">
              This page shows how your app will look with <strong>mock data</strong>.
              Everything here works without Supabase!
            </p>
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Latest Prints
          </h2>
          <p className="text-gray-600">
            Browse amazing 3D prints from the community
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockPrints.map((print) => (
            <PrintCard key={print.id} print={print} />
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold mb-4">What's Working Here?</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong className="text-green-600">UI & Layout</strong>
                <p className="text-gray-600">Beautiful card design, responsive grid, Tailwind styling</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong className="text-green-600">Components</strong>
                <p className="text-gray-600">PrintCard component rendering correctly with all data</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">✅</span>
              <div>
                <strong className="text-green-600">Navigation</strong>
                <p className="text-gray-600">Links work (they'd go to detail pages)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <strong className="text-red-600">No Real Data</strong>
                <p className="text-gray-600">This is hardcoded mock data, not from database</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <strong className="text-red-600">Can't Upload</strong>
                <p className="text-gray-600">No storage for 3D files or images</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-2xl">❌</span>
              <div>
                <strong className="text-red-600">Can't Upvote</strong>
                <p className="text-gray-600">No database to store votes</p>
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 font-medium">
              💡 <strong>To make this REAL:</strong> You need Supabase to store data, files, and handle users.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
