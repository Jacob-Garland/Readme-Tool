import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewReadme from './pages/NewReadme'
import EditReadme from './pages/EditReadme'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<NewReadme />} />
      <Route path="/edit" element={<EditReadme />} />
    </Routes>
  )
}

export default App
