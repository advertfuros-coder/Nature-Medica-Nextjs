import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function authenticate(req) {
  try {
    // ✅ AWAIT cookies() in Next.js 15
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return { authenticated: false, user: null };
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'nature-medica-jwt-secret-key-production-32charsmin';
    const decoded = jwt.verify(token, jwtSecret);
    return { authenticated: true, user: decoded };
  } catch (error) {
    console.error('Auth error:', error.message);
    return { authenticated: false, user: null };
  }
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
