import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'

import PublicLayout from './layouts/PublicLayout';
import AppLayout from './layouts/AppLayout';

import Landing from '@/pages/Landing';
import Register from '@/pages/Register'
import Login from '@/pages/Login'
import Dashboard from '@/app/Dashboard';
import Projects from '@/app/Projects';
import Issues from '@/app/Issues';
import Settings from '@/app/Settings';

function App() {
  return (
    <>
    <Routes>
      {/*PUBLIC PAGES WITH NO NAVBAR */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/login" element={<Login />} />
      </Route>


      {/**APP PAGES WITH NAVBAR */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} /> 
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
