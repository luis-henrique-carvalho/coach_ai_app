import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground mb-4">Coach AI</h1>
        <p className="text-muted-foreground mb-8">
          Habit tracking with AI-powered coaching
        </p>
        
        {user ? (
          <Link to="/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
        ) : (
          <Link to="/login">
            <Button>Get Started</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
