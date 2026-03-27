import { Button } from '@/components/ui/button'

interface LoginButtonProps {
  provider: 'google' | 'github'
  label?: string
}

export default function LoginButton({ provider, label }: LoginButtonProps) {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`
  }

  const defaultLabel = `Continue with ${provider === 'google' ? 'Google' : 'GitHub'}`

  return (
    <Button onClick={handleLogin} variant="outline" className="w-full">
      {label || defaultLabel}
    </Button>
  )
}
