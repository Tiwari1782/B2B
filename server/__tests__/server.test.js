import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../server.js';

describe('Server Infrastructure & Security', () => {

  it('should respond to health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Bug2Build API is running.');
  });

  it('should return 404 for unknown routes', async () => {
    const res = await request(app).get('/api/invalid-route-1234');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  describe('Security Headers (Helmet)', () => {
    it('should include strict Content-Security-Policy', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers).toHaveProperty('content-security-policy');
      expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    });

    it('should include X-Content-Type-Options', async () => {
      const res = await request(app).get('/api/health');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should include Strict-Transport-Security in production', async () => {
      // NOTE: HSTS is only active or fully validated over HTTPS or when manually checked,
      // but Helmet should still output it.
      const res = await request(app).get('/api/health');
      expect(res.headers['strict-transport-security']).toBe('max-age=31536000; includeSubDomains');
    });
  });

});
