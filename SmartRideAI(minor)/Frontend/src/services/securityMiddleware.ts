import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import crypto from 'crypto';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
  ip: string;
  userAgent: string;
  requestId: string;
  tenantId: string;
  userId: string;
  action: string;
  status: 'SUCCESS' | 'BLOCKED' | 'FAILED';
  securityFlags?: string[];
}

// In-memory ring buffer for production-grade audit log inspection in UI
const AUDIT_BUFFER_MAX = 100;
export const auditLogStore: AuditLogEntry[] = [];

export function recordAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
  const fullEntry: AuditLogEntry = {
    id: `audit_${crypto.randomUUID().slice(0, 8)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  auditLogStore.unshift(fullEntry);
  if (auditLogStore.length > AUDIT_BUFFER_MAX) {
    auditLogStore.pop();
  }
}

// Correlation ID & Request Context Middleware
export function correlationMiddleware(req: Request, res: Response, next: NextFunction) {
  const reqId = (req.headers['x-request-id'] as string) || `req_${crypto.randomUUID().slice(0, 10)}`;
  req.headers['x-request-id'] = reqId;
  res.setHeader('X-Request-Id', reqId);
  
  // Set security isolation headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    recordAuditLog({
      method: req.method,
      path: req.originalUrl || req.path,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.socket.remoteAddress || '127.0.0.1',
      userAgent: req.headers['user-agent'] || 'Unknown Agent',
      requestId: reqId,
      tenantId: 'tenant_pro_karthikam',
      userId: 'usr_karthik_083',
      action: `${req.method} ${req.path}`,
      status: res.statusCode < 400 ? 'SUCCESS' : res.statusCode === 429 ? 'BLOCKED' : 'FAILED',
    });
  });
  next();
}

// Zod Input Validation Middleware
export function validateBody<T>(schema: z.ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(422).json({
          error: 'UnprocessableEntity',
          message: 'Input validation failed against security schema',
          details: err.issues.map((i) => ({
            field: i.path.join('.'),
            message: i.message,
          })),
          requestId: req.headers['x-request-id'],
        });
      }
      next(err);
    }
  };
}
