import { Link } from "react-router-dom"

export default function Landing() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-6">
      <h1 className="text-5xl font-bold">OpsPilot</h1>
      <p className="text-slate-600 max-w-md">
        The modern workspace for managing projects, issues and teams.
      </p>

      <div className="flex gap-4">
        <Link to="/login" className="px-6 py-3 bg-black text-white rounded-lg">
          Login
        </Link>
        <Link to="/register" className="px-6 py-3 border rounded-lg">
          Get Started
        </Link>
      </div>
    </div>
  )
}
