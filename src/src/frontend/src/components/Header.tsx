import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Loader2, LogIn, LogOut, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [isDark, setIsDark] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  useEffect(() => {
    const root = window.document.documentElement;
    const initialDark = root.classList.contains('dark');
    setIsDark(initialDark);
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newDark = !isDark;
    
    if (newDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    setIsDark(newDark);
  };

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="border-b-2 border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent" />
          <h1 className="font-display text-xl font-bold tracking-tight">
            GLITCH <span className="text-primary">ENTERPRISES</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="glitch-hover"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            onClick={handleAuth}
            disabled={disabled}
            variant={isAuthenticated ? 'secondary' : 'default'}
            className="glitch-hover gap-2"
          >
            {disabled ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isAuthenticated ? (
              <>
                <LogOut className="h-4 w-4" />
                Logout
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
