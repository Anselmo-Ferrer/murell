# 🚀 Guia de Configuração do Supabase

Este guia te ajudará a configurar o Supabase como banco de dados para o projeto Murell.

## 📋 Passo a Passo

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Faça login ou crie uma conta (gratuita)
3. Clique em **New Project**
4. Preencha:
   - **Name**: Nome do seu projeto (ex: `murell`)
   - **Database Password**: Escolha uma senha forte e **salve ela** (você precisará depois)
   - **Region**: Escolha a região mais próxima
5. Clique em **Create new project**

### 2. Obter Connection String

1. No dashboard do seu projeto, vá em **Settings** (ícone de engrenagem)
2. Clique em **Database** no menu lateral
3. Role até a seção **Connection string**
4. Selecione a aba **URI**
5. Copie a connection string que aparece

A string terá este formato:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 3. Configurar Variáveis de Ambiente

1. No diretório `backend`, crie um arquivo `.env`:
```bash
cp .env.example .env
```

2. Edite o arquivo `.env` e adicione:

```env
# Connection String do Supabase
# IMPORTANTE: Para migrations, use SEM pgbouncer
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@db.SEU_PROJECT_REF.supabase.co:5432/postgres"

# JWT Secret (gere uma string aleatória forte)
JWT_SECRET="sua-chave-secreta-super-forte-aqui"

# Outras configurações
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

**⚠️ IMPORTANTE**: 
- Substitua `SUA_SENHA_AQUI` pela senha que você definiu ao criar o projeto
- Substitua `SEU_PROJECT_REF` pelo ID do seu projeto (aparece na URL do dashboard)

### 4. Executar Migrations

Agora você pode criar as tabelas no Supabase:

```bash
# Gerar o Prisma Client
npm run prisma:generate

# Criar as tabelas no Supabase
npm run prisma:migrate

# (Opcional) Popular com dados de exemplo
npm run prisma:seed
```

### 5. Verificar no Supabase

1. No dashboard do Supabase, vá em **Table Editor**
2. Você deve ver todas as tabelas criadas:
   - `users`
   - `boards`
   - `board_members`
   - `columns`
   - `cards`
   - `labels`
   - `card_labels`
   - `card_members`
   - `comments`
   - `card_likes`
   - `attachments`
   - `notifications`

## 🔧 Connection Strings: Migrations vs Aplicação

### Para Migrations (Prisma Migrate)
Use a connection string **SEM** `pgbouncer`:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

### Para Aplicação (Produção)
Use a connection string **COM** `pgbouncer` para melhor performance:
```
postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
```

**Dica**: Você pode ter duas variáveis de ambiente:
- `DATABASE_URL` - Para migrations (sem pgbouncer)
- `DATABASE_URL_APP` - Para aplicação (com pgbouncer)

## 🛠️ Ferramentas Úteis

### Prisma Studio
Visualize e edite dados diretamente:
```bash
npm run prisma:studio
```
Isso abre uma interface web em `http://localhost:5555`

### Supabase Dashboard
- **Table Editor**: Visualizar e editar dados
- **SQL Editor**: Executar queries SQL
- **Database**: Ver estatísticas e configurações

## 🔒 Segurança

1. **Nunca** commite o arquivo `.env` no Git
2. Use senhas fortes para o banco de dados
3. Em produção, use variáveis de ambiente do seu provedor de hospedagem
4. O Supabase oferece SSL por padrão (seguro)

## 📊 Limites do Plano Gratuito

O plano gratuito do Supabase inclui:
- 500 MB de banco de dados
- 2 GB de bandwidth
- 50.000 usuários ativos mensais
- API ilimitada

Para projetos maiores, considere upgrade.

## 🐛 Troubleshooting

### Erro: "Connection refused"
- Verifique se a connection string está correta
- Confirme que a senha está correta
- Verifique se o projeto está ativo no Supabase

### Erro: "Too many connections"
- Use a connection string com `pgbouncer=true` para a aplicação
- Verifique se não há muitas conexões abertas

### Erro nas Migrations
- Certifique-se de usar a connection string **SEM** `pgbouncer`
- Verifique se tem permissões no banco

## 📚 Recursos

- [Documentação do Supabase](https://supabase.com/docs)
- [Prisma com Supabase](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-supabase)
- [Supabase Dashboard](https://app.supabase.com)

