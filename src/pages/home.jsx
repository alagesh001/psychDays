import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Module 1
        </h1>

        <p className="text-sm text-gray-500 text-center mb-6">
          🌟Premium Version🌟
        </p>

        <div className="space-y-4">

          <Link
            to="/activity1"
            className="group block p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-100 group hover:bg-blue-100 transition">
  <div>
    <h2 className="font-semibold text-gray-800 group-hover:text-blue-700">
      Activity 1
    </h2>
    <p className="text-xs text-gray-500">
      Start interactive session
    </p>
  </div>

  <span className="text-blue-500 text-lg group-hover:translate-x-1 transition">
    →
  </span>
</div>
          </Link>

          <Link
            to="/activity2"
            className="group block p-4 rounded-xl border border-gray-200 hover:border-green-400 hover:shadow-md transition-all duration-200"
          >
          <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 border border-green-100 group hover:bg-green-100 transition">
  <div>
    <h2 className="font-semibold text-gray-800 group-hover:text-green-700">
      Activity 2
    </h2>
    <p className="text-xs text-gray-500">
      Audio based viewer
    </p>
  </div>

  <span className="text-green-500 text-lg group-hover:translate-x-1 transition">
    →
  </span>
</div>
          </Link>

        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          v1.0 • Interactive Board System
        </div>
      </div>
    </div>
  );
}

export default Home;