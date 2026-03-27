import LoginButton from '@/components/LoginButton'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome to Coach AI</h1>
          <p className="text-muted-foreground">Sign in to get started</p>
        </div>
        
        <div className="space-y-4">
          <LoginButton provider="google" />
          <LoginButton provider="github" />
        </div>
      </div>
    </div>
  )
}
