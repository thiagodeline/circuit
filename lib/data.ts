import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';
import { Torneio, Time, Partida, Noticia, Inscricao, PontosCircuito } from '@/types';

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

// --- Inscrições (envio público, gestão só pelo admin) ---

export async function criarInscricao(dados: Omit<Inscricao, 'id' | 'criadoEm' | 'status'>) {
  return addDoc(collection(db, 'inscricoes'), { ...dados, status: 'pendente', criadoEm: Date.now() });
}

export async function listarInscricoesPorTorneio(torneioId: string): Promise<Inscricao[]> {
  const snap = await getDocs(query(collection(db, 'inscricoes'), where('torneioId', '==', torneioId)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Inscricao);
}

export async function atualizarInscricao(id: string, dados: Partial<Inscricao>) {
  return updateDoc(doc(db, 'inscricoes', id), dados);
}

export async function excluirInscricao(id: string) {
  return deleteDoc(doc(db, 'inscricoes', id));
}

// --- Pontos de Circuito (acumulados por torneio da cadeia oficial) ---
// O ranking nunca é uma posição fixa: é sempre a soma desses lançamentos por time.

export async function listarTodosOsTimes(): Promise<Time[]> {
  const snap = await getDocs(collection(db, 'times'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Time);
}

export async function listarPontosCircuito(): Promise<PontosCircuito[]> {
  const snap = await getDocs(query(collection(db, 'pontos_circuito'), orderBy('criadoEm', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PontosCircuito);
}

export async function lancarPontosCircuito(dados: Omit<PontosCircuito, 'id' | 'criadoEm'>) {
  return addDoc(collection(db, 'pontos_circuito'), { ...dados, criadoEm: Date.now() });
}

export async function atualizarPontosCircuito(id: string, dados: Partial<PontosCircuito>) {
  return updateDoc(doc(db, 'pontos_circuito', id), dados);
}

export async function excluirPontosCircuito(id: string) {
  return deleteDoc(doc(db, 'pontos_circuito', id));
}

// --- Torneio ativo por fase da liga (Série A / Série B) ---

export async function buscarTorneioPorFase(fase: 'Série A' | 'Série B'): Promise<Torneio | null> {
  const todos = await listarTorneios();
  return todos.find((t) => t.faseCircuito === fase) || null;
}

// --- Pré-inscrição / lista de espera para as vagas abertas da Série B ---

export interface PreInscricaoSerieB {
  id: string;
  nomeTime: string;
  tag: string;
  capitao: string;
  contato: string;
  criadoEm: number;
}

export async function criarPreInscricaoSerieB(dados: Omit<PreInscricaoSerieB, 'id' | 'criadoEm'>) {
  return addDoc(collection(db, 'pre_inscricoes_serie_b'), { ...dados, criadoEm: Date.now() });
}

export async function listarPreInscricoesSerieB(): Promise<PreInscricaoSerieB[]> {
  const snap = await getDocs(query(collection(db, 'pre_inscricoes_serie_b'), orderBy('criadoEm', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as PreInscricaoSerieB);
}

// --- Configuração da temporada (valores editáveis pelo admin) ---

export interface ConfigTemporada {
  inscricaoSerieA: string;
  premio1SerieA: string;
  premio2SerieA: string;
  inscricaoSerieB: string;
  premio1SerieB: string;
  premio2SerieB: string;
}

const CONFIG_PADRAO: ConfigTemporada = {
  inscricaoSerieA: 'R$ 150,00 por time',
  premio1SerieA: 'R$ 800,00',
  premio2SerieA: 'R$ 200,00',
  inscricaoSerieB: 'R$ 150,00 por time (vagas abertas)',
  premio1SerieB: 'R$ 500,00',
  premio2SerieB: 'R$ 200,00',
};

export async function buscarConfigTemporada(): Promise<ConfigTemporada> {
  const snap = await getDoc(doc(db, 'configuracoes', 'temporada'));
  return snap.exists() ? { ...CONFIG_PADRAO, ...(snap.data() as Partial<ConfigTemporada>) } : CONFIG_PADRAO;
}

export async function atualizarConfigTemporada(dados: ConfigTemporada) {
  return setDoc(doc(db, 'configuracoes', 'temporada'), dados);
}
