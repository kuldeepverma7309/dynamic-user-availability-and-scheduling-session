import React from 'react'
import Header from './components/Header'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Sessions from './pages/Sessions'
import Dashboard from './pages/Dashboard'
import Availability from './pages/Availability'
import EditSession from './pages/EditSession'
import EditAvailability from './pages/EditAvailabilityCard'
import CreateAvailability from './pages/CreateAvailability'
import ScheduleNewSession from './pages/ScheduleNewSession'
import SessionTable from './pages/UpdateSessionStatus'
import Footer from './components/Footer'
import { SocketProvider } from './utils/SocketProvider'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <SocketProvider>
      <div className='flex flex-col bg-slate-200 w-full'>
      <Header />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/sessions' element={<Sessions/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/availability' element={<Availability/>} />
        <Route path='/session/:id' element={<EditSession/>} />
        <Route path='/edit-availability/:id' element={<EditAvailability/>} />
        <Route path='/create-availability' element={<CreateAvailability/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
        <Route path='/update-session-status' element={<SessionTable/>} />
        <Route path='/schedule-new-session' element={<ScheduleNewSession/>} />
        <Route path='*' element={<NotFound/>} />
      </Routes>
      <Footer/>
    </div>
    </SocketProvider>
  )
}

export default App