import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Torneio, Time, Partida, Noticia } from '@/types';

// --- Torneios ---

export async function listarTorneios(): Promise<Torneio[]> {
  const snap = await getDocs(query(collection(db, 'torneios'), orderBy('criadoEm', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Torneio);
}

export async function buscarTorneioPorSlug(slug: string): Promise<Torneio | null> {
  const snap = await getDocs(query(collection(db, 'torneios'), where('slug', '==', slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Torneio;
}

export async function criarTorneio(dados: Omit<Torneio, 'id' | 'criadoEm'>) {
  return addDoc(collection(db, 'torneios'), { ...dados, criadoEm: Date.now() });
}

export async function atualizarTorneio(id: string, dados: Partial<Torneio>) {
  return updateDoc(doc(db, 'torneios', id), dados);
}

export async function excluirTorneio(id: string) {
  return deleteDoc(doc(db, 'torneios', id));
}

// --- Times ---

export async function listarTimesPorTorneio(torneioId: string): Promise<Time[]> {
  const snap = await getDocs(query(collection(db, 'times'), where('torneioId', '==', torneioId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Time);
}

export async function buscarTimePorId(id: string): Promise<Time | null> {
  const snap = await getDoc(doc(db, 'times', id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Time;
}

export async function criarTime(dados: Omit<Time, 'id' | 'criadoEm'>) {
  return addDoc(collection(db, 'times'), { ...dados, criadoEm: Date.now() });
}

export async function atualizarTime(id: string, dados: Partial<Time>) {
  return updateDoc(doc(db, 'times', id), dados);
}

export async function excluirTime(id: string) {
  return deleteDoc(doc(db, 'times', id));
}

// --- Partidas / Resultados ---

export async function listarPartidasPorTorneio(torneioId: string): Promise<Partida[]> {
  const snap = await getDocs(query(collection(db, 'partidas'), where('torneioId', '==', torneioId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Partida);
}

export async function criarPartida(dados: Omit<Partida, 'id' | 'criadoEm'>) {
  return addDoc(collection(db, 'partidas'), { ...dados, criadoEm: Date.now() });
}

export async function atualizarPartida(id: string, dados: Partial<Partida>) {
  return updateDoc(doc(db, 'partidas', id), dados);
}

export async function excluirPartida(id: string) {
  return deleteDoc(doc(db, 'partidas', id));
}

// --- Notícias ---

export async function listarNoticias(): Promise<Noticia[]> {
  const snap = await getDocs(query(collection(db, 'noticias'), orderBy('publicadoEm', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Noticia);
}

export async function buscarNoticiaPorSlug(slug: string): Promise<Noticia | null> {
  const snap = await getDocs(query(collection(db, 'noticias'), where('slug', '==', slug)));
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...d.data() } as Noticia;
}

export async function criarNoticia(dados: Omit<Noticia, 'id' | 'publicadoEm'>) {
  return addDoc(collection(db, 'noticias'), { ...dados, publicadoEm: Date.now() });
}

export async function atualizarNoticia(id: string, dados: Partial<Noticia>) {
  return updateDoc(doc(db, 'noticias', id), dados);
}

export async function excluirNoticia(id: string) {
  return deleteDoc(doc(db, 'noticias', id));
}
