import Header from '../../components/layout/Header'

export default function OfficerHomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Officer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900">Open Issues</h2>
            <p className="mt-2 text-3xl font-bold text-primary-600">--</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900">In Progress</h2>
            <p className="mt-2 text-3xl font-bold text-yellow-600">--</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900">Resolved</h2>
            <p className="mt-2 text-3xl font-bold text-green-600">--</p>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Assigned Issues</h2>
          <p className="text-gray-600">Assigned issues will be displayed here.</p>
        </div>
      </main>
    </div>
  )
}
