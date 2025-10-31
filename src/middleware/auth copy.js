import { verifyToken } from '@/lib/jwt';

// For API routes: get cookie from request headers
function getTokenFromReq(req) {
  // For Next.js API Routes using "Request" in app directory:
  try {
    // New Next.js API Routes (app directory, Edge)
    if (typeof req.cookies?.get === 'function') {
      return req.cookies.get('token')?.value;
    }
    // Fallback for old style (pages directory)
    if (req.headers && req.headers.cookie) {
      const match = req.headers.cookie.match(/token=([^;]+)/);
      return match ? match[1] : null;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export async function authenticate(req) {
  const token = getTokenFromReq(req);
  if (!token) return { authenticated: false, user: null };
  const decoded = verifyToken(token);
  if (!decoded) return { authenticated: false, user: null };
  return { authenticated: true, user: decoded };
}

export async function requireAuth(req) {
  const auth = await authenticate(req);
  if (!auth.authenticated) {
    throw new Error('Authentication required');
  }
  return auth.user;
}

export async function requireAdmin(req) {
  const user = await requireAuth(req);
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  return user;
}
