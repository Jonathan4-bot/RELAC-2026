import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { migrate } from './src/database/migrate.js';

// Import routes
import authRoutes from './src/routes/auth.routes.js';
import participantRoutes from './src/routes/participant.routes.js';
import adminRoutes from './src/routes/admin.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';
import exportRoutes from './src/routes/export.routes.js';
import badgeRoutes from './src/routes/badge.routes.js';
import presenceRoutes from './src/routes/presence.routes.js';

// Import middleware
import { errorHandler } from './src/middleware/error.middleware.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Run migrations BEFORE starting the server
try {
  console.log('🔄 Lancement des migrations...');
  migrate();
  console.log('✅ Migrations terminées.');
} catch (err) {
  console.error('❌ Erreur lors de la migration:', err);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/badge', badgeRoutes);
app.use('/api/presences', presenceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'RELAC 2026 API is running' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

export default app;
