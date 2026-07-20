'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, carregando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!carregando && !user) router.replace('/admin/login');
  }, [carregando, user, router]);

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-base text-muted">
        Carregando…
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
