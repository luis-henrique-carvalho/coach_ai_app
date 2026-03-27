import UserProfile from '@/components/UserProfile'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        
        <UserProfile />
        
        <div className="text-muted-foreground">
          <p>Your habit tracking and coaching dashboard will appear here.</p>
        </div>
      </div>
    </div>
  )
}
