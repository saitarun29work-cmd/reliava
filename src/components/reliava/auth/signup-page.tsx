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
// SignupPage
// ---------------------------------------------------------------------------

export function SignupPage() {
  const signup = useAppStore((s) => s.signup);
  const navigate = useAppStore((s) => s.navigate);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agency, setAgency] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = 'Full name is required.';
    if (!email.trim()) next.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = 'Enter a valid email address.';
    if (!password) next.password = 'Password is required.';
    else if (password.length < 8)
      next.password = 'Password must be at least 8 characters.';
    if (!agency.trim()) next.agency = 'Agency name is required.';

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      const ok = signup(name, email, password);
      if (!ok) {
        setErrors({ form: 'Something went wrong. Please try again.' });
      }
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
            Create your account
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            {/* Full Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                placeholder="Marcus Chen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-destructive text-sm">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@agency.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-destructive text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="grid gap-1.5">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-destructive text-sm">{errors.password}</p>
              )}
            </div>

            {/* Agency Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="signup-agency">Agency Name</Label>
              <Input
                id="signup-agency"
                placeholder="Your Agency Name"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                autoComplete="organization"
                disabled={loading}
              />
              {errors.agency && (
                <p className="text-destructive text-sm">{errors.agency}</p>
              )}
            </div>

            {/* Form-level error */}
            {errors.form && (
              <p className="text-destructive text-sm">{errors.form}</p>
            )}

            {/* Create Account */}
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
              onClick={() => navigate({ page: 'login' })}
            >
              Sign in
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}