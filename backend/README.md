# Murell Backend API

Backend API para o sistema de Kanban Board Murell, construído com Node.js, Express, TypeScript e Prisma.

## 🏗️ Arquitetura

A arquitetura segue o padrão de **camadas** (Layered Architecture):

```
src/
├── config/          # Configurações (database, env)
├── controllers/     # Controladores (HTTP handlers)
├── middlewares/     # Middlewares (auth, validation, error)
├── repositories/    # Camada de acesso a dados
├── routes/          # Definição de rotas
├── services/        # Lógica de negócio
├── types/           # Tipos TypeScript compartilhados
├── utils/           # Utilitários (hash, jwt, errors)
└── server.ts        # Servidor Express principal
```

### Camadas

1. **Routes**: Define as rotas HTTP e conecta aos controllers
2. **Controllers**: Recebe requisições HTTP e chama os services
3. **Services**: Contém a lógica de negócio e validações
4. **Repositories**: Camada de acesso a dados (Prisma)
5. **Middlewares**: Autenticação, validação, tratamento de erros

## 🚀 Como começar

### Pré-requisitos

- Node.js 18+
- Conta no [Supabase](https://supabase.com) (gratuita)
- npm ou yarn

### Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure o Supabase:

   a. Crie um projeto no [Supabase](https://supabase.com)
   
   b. Vá em **Settings** → **Database** e copie a **Connection String**
   
   c. Use a connection string no formato:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
   ```
   
   **Importante**: Para migrations, use a connection string **sem** `pgbouncer=true`:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
   ```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Connection String do Supabase (sem pgbouncer para migrations)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Para uso em produção, você pode usar a connection string com pgbouncer
# DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"

JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
CORS_ORIGIN="http://localhost:3000"
```

4. Configure o banco de dados:
```bash
# Gerar o Prisma Client
npm run prisma:generate

# Executar migrations (cria as tabelas no Supabase)
npm run prisma:migrate

# (Opcional) Popular o banco com dados iniciais
npm run prisma:seed
```

4. Inicie o servidor:
```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Login

### Usuários
- `GET /api/users/profile` - Obter perfil (autenticado)
- `PUT /api/users/profile` - Atualizar perfil (autenticado)

### Boards
- `GET /api/boards` - Listar boards do usuário
- `GET /api/boards/:id` - Obter board por ID
- `POST /api/boards` - Criar board
- `PUT /api/boards/:id` - Atualizar board
- `DELETE /api/boards/:id` - Deletar board
- `POST /api/boards/:id/members` - Adicionar membro
- `DELETE /api/boards/:id/members/:userId` - Remover membro

### Columns
- `GET /api/columns/board/:boardId` - Listar colunas de um board
- `POST /api/columns/board/:boardId` - Criar coluna
- `PUT /api/columns/:id` - Atualizar coluna
- `DELETE /api/columns/:id` - Deletar coluna
- `POST /api/columns/board/:boardId/reorder` - Reordenar colunas

### Cards
- `GET /api/cards/column/:columnId` - Listar cards de uma coluna
- `GET /api/cards/:id` - Obter card por ID
- `POST /api/cards/column/:columnId` - Criar card
- `PUT /api/cards/:id` - Atualizar card
- `DELETE /api/cards/:id` - Deletar card
- `POST /api/cards/:id/move` - Mover card
- `POST /api/cards/:id/labels` - Adicionar label
- `DELETE /api/cards/:id/labels/:labelId` - Remover label
- `POST /api/cards/:id/like` - Toggle like

### Comments
- `GET /api/comments/card/:cardId` - Listar comentários de um card
- `POST /api/comments/card/:cardId` - Criar comentário
- `PUT /api/comments/:id` - Atualizar comentário
- `DELETE /api/comments/:id` - Deletar comentário

## 🔐 Autenticação

A maioria dos endpoints requer autenticação via JWT. Inclua o token no header:

```
Authorization: Bearer <token>
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento (watch mode)
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em produção
- `npm run prisma:generate` - Gera o Prisma Client
- `npm run prisma:migrate` - Executa migrations
- `npm run prisma:studio` - Abre o Prisma Studio (GUI do banco)
- `npm run prisma:seed` - Popula o banco com dados iniciais

## 📝 Estrutura do Banco de Dados

O schema do Prisma define as seguintes entidades principais:

- **User**: Usuários do sistema
- **Board**: Quadros/boards
- **BoardMember**: Relação usuário-board (com roles)
- **Column**: Colunas dentro de um board
- **Card**: Cards dentro de uma coluna
- **Label**: Labels para cards
- **Comment**: Comentários em cards
- **CardLike**: Likes em cards
- **Attachment**: Anexos em cards
- **Notification**: Notificações para usuários

## 🔒 Segurança

- Senhas são hasheadas com bcrypt
- JWT para autenticação
- Validação de dados com Zod
- Tratamento centralizado de erros
- CORS configurado

## 🧪 Testes

(Em desenvolvimento)

## 📦 Tecnologias

- **Node.js** - Runtime
- **Express** - Framework web
- **TypeScript** - Tipagem estática
- **Prisma** - ORM
- **Supabase** - Banco de dados PostgreSQL gerenciado
- **JWT** - Autenticação
- **Zod** - Validação
- **bcryptjs** - Hash de senhas

## 🔗 Configuração do Supabase

### Obtendo a Connection String

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Settings** → **Database**
3. Role até a seção **Connection string**
4. Selecione **URI** e copie a string
5. Substitua `[YOUR-PASSWORD]` pela senha do seu banco de dados

### Connection Strings

- **Para Migrations**: Use a connection string **sem** `pgbouncer=true`
  ```
  postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
  ```

- **Para Aplicação (Produção)**: Use a connection string **com** `pgbouncer=true` para melhor performance
  ```
  postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1
  ```

### Dicas

- ⚠️ **Nunca** commite sua connection string no Git
- Use variáveis de ambiente diferentes para desenvolvimento e produção
- O Supabase oferece um pool de conexões gratuito, mas para produção considere upgrade
- Você pode usar o Prisma Studio para visualizar dados: `npm run prisma:studio`

## 📄 Licença

ISC

