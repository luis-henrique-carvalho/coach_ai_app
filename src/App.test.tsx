import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

describe('App', () => {
  it('renders home page at root route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/Coach AI/i)).toBeInTheDocument()
    expect(screen.getByText(/Habit tracking/i)).toBeInTheDocument()
  })

  it('renders 404 page for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown']}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText(/404/i)).toBeInTheDocument()
    expect(screen.getByText(/Page not found/i)).toBeInTheDocument()
  })
})
