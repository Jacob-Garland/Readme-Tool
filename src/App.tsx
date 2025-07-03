import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NewReadme from './pages/NewReadme'
import EditReadme from './pages/EditReadme'
import GitReadme from './pages/GitReadme'
import Editor from './pages/Editor'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new" element={<NewReadme />} />
      <Route path="/edit" element={<EditReadme />} />
      <Route path="/git" element={<GitReadme />} />
      {/* The Editor route is for the main editor page */}
      <Route path="/editor" element={<Editor />} />
    </Routes>
  )
}

export default App
