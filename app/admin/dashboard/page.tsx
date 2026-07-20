'use client';

import { useEffect, useState } from 'react';
import { RequireAuth } from '@/components/RequireAuth';
import { AdminSidebar } from '@/components/AdminSidebar';
import { listarTorneios, listarNoticias } from '@/lib/data';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function DashboardPage() {
  const [contagens, setContagens] = useState({ torneios: 0, times: 0, noticias: 0 });

  useEffect(() => {
    async function carregar() {
      try {
        const [torneios, noticias, timesSnap] = await Promise.all([
          listarTorneios(),
          listarNoticias(),
          getDocs(collection(db, 'times')),
        ]);
        setContagens({ torneios: torneios.length, times: timesSnap.size, noticias: noticias.length });
      } catch {
        // Firebase não configurado ainda
      }
    }
    carregar();
  }, []);

  return (
    <RequireAuth>
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 px-10 py-10">
          <p className="eyebrow mb-2">Painel administrativo</p>
          <h1 className="font-display text-3xl font-semibold">Visão geral</h1>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="card p-6">
              <p className="text-sm text-muted">Torneios</p>
              <p className="mt-2 font-display text-3xl font-semibold">{contagens.torneios}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted">Times inscritos</p>
              <p className="mt-2 font-display text-3xl font-semibold">{contagens.times}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm text-muted">Notícias publicadas</p>
              <p className="mt-2 font-display text-3xl font-semibold">{contagens.noticias}</p>
            </div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
