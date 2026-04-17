import * as esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/server.cjs',
  external: ['express', 'bcryptjs', 'jsonwebtoken', 'cors', 'helmet', 'express-rate-limit', '@prisma/client', 'zod', 'cookie-parser'],
  format: 'cjs',
}).catch(() => process.exit(1));
