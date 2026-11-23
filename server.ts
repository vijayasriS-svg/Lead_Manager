import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createDatabase } from './backend/database/db.ts';
import { createBackendApp } from './backend/app.ts';

async function startServer() {
  const parsedPort = Number.parseInt(process.env.PORT || '3000', 10);
  const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : 3000;
  const standaloneBackend = process.env.STANDALONE_BACKEND === 'true';
  const isProduction = process.env.NODE_ENV === 'production';

  const repo = createDatabase(process.env.DATABASE_PATH);
  const app = createBackendApp(repo);

  if (!standaloneBackend) {
    if (!isProduction) {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distDir = path.resolve(process.cwd(), 'dist');
      app.use(express.static(distDir));
      app.get('*', (_req, res) => {
        res.sendFile(path.join(distDir, 'index.html'));
      });
    }
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(
      `Lead Manager ${standaloneBackend ? 'API server' : 'full-stack server'} listening on http://localhost:${port} (SQLite: ${repo.dbPath})`
    );
  });

  const shutdown = () => {
    server.close(() => {
      repo.close();
      process.exit(0);
    });
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start Lead Manager server:', err);
  process.exit(1);
});
