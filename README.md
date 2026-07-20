# Circuit — Site institucional

Site da Circuit (organização de torneios de Valorant), com painel admin protegido por login,
dados no Firebase (Firestore + Auth), feito em Next.js e hospedado na Vercel.

## O que tem

- **Site público**: Home, Torneios (lista + detalhe com times/resultados), Times, Notícias
- **Painel admin** (`/admin`): login, dashboard, CRUD de torneios, times, resultados e notícias
- **Dados**: Firestore (coleções `torneios`, `times`, `partidas`, `noticias`)
- **Login**: Firebase Authentication (email/senha) — o método mais simples e seguro pra um painel
  de poucos administradores, sem precisar gerenciar senhas você mesmo.

## 1. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e clique em **Adicionar projeto**
2. Dê um nome (ex: "circuit") e siga o assistente (pode desativar o Google Analytics se quiser)
3. Dentro do projeto, clique no ícone **`</>`** ("Web") para criar um app web
4. Dê um apelido (ex: "circuit-site") e clique em **Registrar app**
5. Copie os valores de `firebaseConfig` mostrados na tela — você vai usá-los no passo 4

## 2. Ativar Firestore

1. No menu lateral, vá em **Build > Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha uma localização (ex: `southamerica-east1` para menor latência no Brasil)
4. Comece em **modo de produção** (as regras de segurança já estão prontas no arquivo `firestore.rules`)
5. Depois de criado, vá na aba **Regras** e cole o conteúdo do arquivo `firestore.rules` deste
   projeto, substituindo o que estiver lá. Clique em **Publicar**.

## 3. Ativar Authentication e criar seu usuário admin

1. No menu lateral, vá em **Build > Authentication**
2. Clique em **Vamos começar**
3. Ative o provedor **Email/senha**
4. Vá na aba **Users** e clique em **Add user** — crie o email e senha que você vai usar para
   entrar no painel admin (ex: `admin@circuit.gg`)
5. Repita esse passo para cada pessoa da staff que vai ter acesso ao painel

## 4. Configurar as variáveis de ambiente

1. Renomeie `.env.local.example` para `.env.local`
2. Preencha com os valores do `firebaseConfig` que você copiou no passo 1:

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

## 5. Rodar localmente (opcional, pra testar antes do deploy)

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` para o site e `http://localhost:3000/admin/login` para o painel.

## 6. Deploy na Vercel

1. Suba este projeto para um repositório no GitHub (mesmo processo usado no bot do Discord: crie
   o repo, faça upload dos arquivos, sem incluir `.env.local` — ele já está no `.gitignore`)
2. Acesse https://vercel.com/new e importe o repositório
3. Antes de clicar em Deploy, adicione as variáveis de ambiente (mesmos nomes do `.env.local`) em
   **Environment Variables**
4. Clique em **Deploy**

Depois do primeiro deploy, qualquer commit novo no repositório atualiza o site automaticamente.

## 7. Autorizar o domínio da Vercel no Firebase

Depois do deploy, pegue a URL que a Vercel gerou (ex: `circuit-site.vercel.app`) e:

1. No Firebase Console, vá em **Authentication > Settings > Authorized domains**
2. Clique em **Add domain** e cole a URL da Vercel (sem `https://`)

Sem isso, o login do painel admin vai falhar em produção mesmo funcionando localmente.

## Estrutura de dados no Firestore

- **torneios**: `nome`, `slug`, `descricao`, `status`, `formato`, `dataInicio`
- **times**: `torneioId`, `nome`, `tag`, `capitao`, `contato`, `grupo`, `jogadores[]`
- **partidas**: `torneioId`, `fase`, `timeA`, `timeB`, `placarA`, `placarB`, `finalizada`
- **noticias**: `titulo`, `slug`, `resumo`, `conteudo`, `autor`, `publicadoEm`

Todas essas coleções são criadas automaticamente pelo painel admin na primeira vez que você
cadastra algo — não precisa criá-las manualmente no Firestore.

## Primeiro uso

1. Acesse `/admin/login` e entre com o usuário criado no passo 3
2. Vá em **Torneios** e cadastre o Circuit Zen (nome, slug `circuit-zen`, formato "8 times · 2
   grupos · playoffs")
3. Vá em **Times** e cadastre os 8 times do torneio
4. Vá em **Resultados** para criar as partidas e ir atualizando os placares
5. Vá em **Notícias** para publicar os primeiros textos

Tudo isso aparece automaticamente no site público, em `/torneios/circuit-zen`.
