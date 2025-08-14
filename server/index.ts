import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

const app = express();

// Trust proxy for accurate client IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      connectSrc: ["'self'", "ws:", "wss:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || ['https://your-domain.replit.app']
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
}));

// Compression middleware
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  },
  threshold: 1024, // Only compress responses larger than 1KB
}));

// Enhanced Rate limiting
const createRateLimit = (windowMs: number, max: number, message: string) => 
  rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      log(`⚠️  Rate limit exceeded for IP: ${req.ip} on ${req.path}`);
      res.status(429).json({ 
        error: message,
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString(),
      });
    },
  });

// Different rate limits for different endpoints
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per window
  "Too many requests from this IP, please try again later."
);

const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 auth attempts per window
  "Too many authentication attempts, please try again later."
);

const chatLimiter = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 chat messages per minute
  "Too many chat requests, please slow down."
);

// Apply rate limits
app.use('/api/login', authLimiter);
app.use('/api/register', authLimiter);
app.use('/api/conversations/*/messages', chatLimiter);
app.use('/api', generalLimiter);

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf.toString());
    } catch (e) {
      const error = new Error('Invalid JSON payload');
      (error as any).status = 400;
      throw error;
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 1000
}));

// Professional request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  const method = req.method;
  const ip = req.ip || 'unknown';
  const userAgent = req.get('User-Agent')?.substring(0, 50) || 'Unknown';

  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    }).format(new Date());

    if (path.startsWith("/api")) {
      const status = res.statusCode;
      let logLine = `${timestamp} [${method}] ${path} - ${status} - ${duration}ms - ${ip}`;

      // Add response preview for successful requests
      if (status >= 200 && status < 400 && capturedJsonResponse && Object.keys(capturedJsonResponse).length > 0) {
        const responsePreview = JSON.stringify(capturedJsonResponse).substring(0, 100);
        logLine += ` :: ${responsePreview}${responsePreview.length >= 100 ? '...' : ''}`;
      }

      // Add error info for failed requests
      if (status >= 400 && capturedJsonResponse?.error) {
        logLine += ` :: ERROR: ${capturedJsonResponse.error}`;
      }

      // Color coding based on status
      if (status >= 500) {
        log(`🔴 ${logLine}`); // Server errors
      } else if (status >= 400) {
        log(`🟡 ${logLine}`); // Client errors
      } else if (status >= 200 && status < 300) {
        log(`🟢 ${logLine}`); // Success
      } else {
        log(`🔵 ${logLine}`); // Other
      }
    }
  });

  next();
});

// Health check endpoint with detailed system info
app.get('/health', (req, res) => {
  const uptime = process.uptime();
  const memoryUsage = process.memoryUsage();

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: {
      seconds: Math.floor(uptime),
      formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
    },
    memory: {
      used: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
      total: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
      external: `${Math.round(memoryUsage.external / 1024 / 1024)}MB`
    },
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0',
    features: {
      database: 'SQLite3',
      authentication: 'Passport.js + bcrypt',
      ai_provider: 'Catalyst IA Engine',
      security: 'Helmet + CORS + Rate Limiting'
    }
  });
});

// API status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    api: 'Catalyst IA Chat',
    version: '2.0.0',
    status: 'operational',
    endpoints: {
      auth: '/api/login, /api/register, /api/logout, /api/user',
      chat: '/api/conversations, /api/conversations/:id/messages',
      health: '/health'
    },
    rateLimit: {
      general: '100 requests / 15 minutes',
      auth: '5 attempts / 15 minutes',
      chat: '10 messages / minute'
    }
  });
});

(async () => {
  try {
    log("🚀 Starting Catalyst IA Server...");

    const server = await registerRoutes(app);

    // Enhanced global error handler
    app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
      const timestamp = new Date().toISOString();
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

      // Log error with context
      log(`🔴 [ERROR] ${timestamp} - ${req.method} ${req.path} - ${status} - ${message}`);
      if (stack && process.env.NODE_ENV === 'development') {
        console.error(stack);
      }

      // Professional error response
      res.status(status).json({
        error: status < 500 || process.env.NODE_ENV === 'development' ? message : 'Internal server error',
        timestamp,
        path: req.path,
        method: req.method,
        requestId: req.headers['x-request-id'] || 'unknown',
        ...(stack && process.env.NODE_ENV === 'development' && { stack: stack.split('\n').slice(0, 10) }),
      });
    });

    // 404 handler for API routes
    app.use('/api/*', (req, res) => {
      res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl,
        method: req.method,
        timestamp: new Date().toISOString(),
        availableEndpoints: [
          'GET /health',
          'GET /api/status',
          'GET /api/user',
          'POST /api/login',
          'POST /api/register',
          'POST /api/logout',
          'GET /api/conversations',
          'POST /api/conversations',
          'DELETE /api/conversations/:id',
          'GET /api/conversations/:id/messages',
          'POST /api/conversations/:id/messages'
        ]
      });
    });

    // Setup Vite for development or serve static files for production
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    // Server startup
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = process.env.HOST || '0.0.0.0';

    server.listen({
      port,
      host,
      reusePort: true,
    }, () => {
      log(`🌟 Catalyst IA Server successfully started!`);
      log(`📡 Server listening on http://${host}:${port}`);
      log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      log(`💾 Database: SQLite3 with Better-SQLite3`);
      log(`🔐 Security: Helmet + CORS + Rate Limiting enabled`);
      log(`🤖 AI Provider: Catalyst IA Engine`);
      log(`✅ All systems operational - Ready to serve requests!`);
    });

    // Graceful shutdown handling
    const gracefulShutdown = (signal: string) => {
      log(`⚠️  ${signal} received. Starting graceful shutdown...`);
      server.close(() => {
        log(`✅ Server closed gracefully`);
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        log(`❌ Forcing shutdown after timeout`);
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      log(`🔴 Uncaught Exception: ${error.message}`);
      console.error(error.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      log(`🔴 Unhandled Rejection at: ${promise}, reason: ${reason}`);
      process.exit(1);
    });

  } catch (error) {
    log(`🔴 Failed to start server: ${error}`);
    console.error(error);
    process.exit(1);
  }
})();