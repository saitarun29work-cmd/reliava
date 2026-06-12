'use client';

import { useState, type FormEvent } from 'react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// ---------------------------------------------------------------------------
// LoginPage
// ---------------------------------------------------------------------------

export function LoginPage() {
  const login = useAppStore((s) => s.login);
  const navigate = useAppStore((s) => s.navigate);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);
    // Small artificial delay so the user perceives a network call
    setTimeout(() => {
      const ok = login(email, password);
      if (!ok) {
        setError('Invalid credentials');
      }
      setLoading(false);
    }, 400);
  }

  function handleDemo() {
    setError('');
    setLoading(true);
    setTimeout(() => {
      login('demo@reliava.com', 'demo');
      setLoading(false);
    }, 400);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-border bg-card">
        <CardHeader className="text-center pb-2">
          {/* Logo */}
          <CardTitle className="text-2xl font-bold tracking-tight">
            <span className="text-emerald-400">RELI</span>
            <span className="text-foreground">AVA</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Know what broke before your client complains.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-destructive text-sm">{error}</p>
            )}

            {/* Sign in */}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>

            {/* Divider */}
            <div className="relative my-2 flex items-center justify-center">
              <span className="shrink-0 bg-card px-2 text-xs text-muted-foreground">
                — or continue with —
              </span>
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
            </div>

            {/* Demo button */}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemo}
              disabled={loading}
            >
              Continue as Demo
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              onClick={() => navigate({ page: 'signup' })}
            >
              Sign up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}