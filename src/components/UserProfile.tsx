import { useAuth } from '@/contexts/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export default function UserProfile() {
  const { user, logout } = useAuth()
  
  if (!user) return null
  
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase()
  
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg bg-card">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <div className="flex-1">
        <p className="font-semibold text-foreground">{user.name}</p>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      
      <Button onClick={logout} variant="outline" size="sm">
        Logout
      </Button>
    </div>
  )
}
