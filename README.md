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

## Inscrição paga (PIX via Mercado Pago)

Torneios podem ter um valor de inscrição — nesse caso o time paga via PIX antes da
inscrição ser enviada pra staff revisar. Pra ativar isso:

### 1. Pegar o Access Token do Mercado Pago

1. Acesse https://www.mercadopago.com.br/developers/panel/app
2. Crie uma aplicação (ou use uma existente)
3. Vá em **Credenciais de produção** e copie o **Access Token** (começa com `APP_USR-...`)
   - Use as credenciais de **teste** primeiro pra validar o fluxo, e só troque pra produção
     quando estiver tudo funcionando

### 2. Gerar a chave de serviço do Firebase (permite ao servidor escrever no Firestore com segurança)

1. No Firebase Console, vá em **Configurações do projeto > Contas de serviço**
2. Clique em **Gerar nova chave privada** — baixa um arquivo `.json`
3. Converta esse arquivo pra base64 (necessário porque variáveis de ambiente não aceitam
   quebras de linha bem). No terminal:
   ```bash
   base64 -i caminho/para/o-arquivo.json | tr -d '\n'
   ```
   (no Windows, use um site confiável de conversão base64 ou o PowerShell:
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes("arquivo.json"))`)
4. Copie o resultado — é uma string longa, sem quebras de linha

### 3. Configurar as variáveis de ambiente

No Railway/Vercel (aba **Environment Variables** do projeto do site), adicione:

```
MP_ACCESS_TOKEN=APP_USR-...
FIREBASE_SERVICE_ACCOUNT_KEY=<a string base64 do passo 2>
```

**Importante**: essas duas variáveis NÃO devem ter o prefixo `NEXT_PUBLIC_` — são segredos
que só o servidor pode ver. Nunca as exponha no código do navegador.

### 4. Configurar o webhook no Mercado Pago

1. No painel do Mercado Pago, vá em **Sua aplicação > Webhooks**
2. Adicione a URL: `https://SEU-DOMINIO.vercel.app/api/inscricao/webhook`
3. Selecione o evento **Pagamentos**

### 5. Definir o valor de um torneio

No admin, ao criar/editar um torneio, preencha **"Valor da inscrição (R$)"**. Deixe em
branco para manter a inscrição gratuita (funciona exatamente como antes).

### Como funciona por trás

1. O time preenche o formulário de inscrição normalmente
2. Se o torneio tiver valor, o site chama uma API interna (`/api/inscricao/pix`) que:
   - Confirma o valor real do torneio direto no banco (nunca confia no que vem do navegador)
   - Cria a inscrição no Firestore com status `aguardando_pagamento`
   - Gera a cobrança PIX no Mercado Pago e devolve o QR code pro time escanear
3. O time paga, o Mercado Pago avisa o site via webhook (`/api/inscricao/webhook`)
4. O webhook confirma o pagamento e muda o status da inscrição pra `pendente` — só a
   partir daí ela aparece na lista de "Pendentes" no admin, pronta pra você aprovar
5. Enquanto isso, o site do time fica checando a cada poucos segundos se o pagamento
   já foi confirmado, e mostra a tela de sucesso automaticamente
