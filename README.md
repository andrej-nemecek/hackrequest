# HackRequest Template Repo

## Getting Started

### Supabase
1. If you plan to use Supabase as the database provider (recommended), create a new project on [Supabase](https://supabase.io/).
2. Create a database in your Supabase project.
3. Go to Database and click on Connect button on the top of the page.
4. Click on App frameworks and select Next.js using App router with supabase-js.
5. Copy the environment variables a fill them in the `.env.template` file.
6. Click on Connection string, copy the transaction pooler string and fill it in the `.env.template` file.
3. Rename `.env.template` to `.env.local`

### Codebase

1. Install
```bash
npm i
```

2. Update the database with initial Users table
```bash
npx drizzle-kit push
```

3. Run the development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
