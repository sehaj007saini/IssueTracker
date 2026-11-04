import { Link } from 'react-router-dom'
import Header from '../../components/layout/Header'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Report Civic Issues in Your Community
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Help improve your neighborhood by reporting potholes, broken infrastructure, and other civic problems. 
            Track progress and verify when issues are resolved.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/report"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
              >
                Report an Issue
              </Link>
            </div>
            <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
              <Link
                to="/my-reports"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                View My Reports
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Report Issues
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Take a photo, add location, and describe the problem
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Track Progress
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Monitor the status of your reported issues in real-time
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Verify Solutions
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        Confirm when issues are properly resolved by authorities
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-primary-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              How It Works
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto text-xl font-bold">
                  1
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Spot a Problem</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Notice a pothole or infrastructure issue in your area
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto text-xl font-bold">
                  2
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Report It</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Take a photo and submit the report with your location
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto text-xl font-bold">
                  3
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Officers Resolve</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Municipal officers work on fixing the reported issue
                </p>
              </div>
              <div>
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-500 text-white mx-auto text-xl font-bold">
                  4
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">You Verify</h3>
                <p className="mt-2 text-sm text-gray-500">
                  Confirm the issue has been properly fixed
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
