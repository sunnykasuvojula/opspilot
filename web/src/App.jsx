import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className="min-h-screen grid place-items-center">
      <h1 className="text-3xl font-bold border border-amber-400 font-bold underline p-12">Tailwind is working ✅</h1>
    </div>
    </>
  )
}

export default App
