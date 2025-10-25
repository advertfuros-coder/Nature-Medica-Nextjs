import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function authenticate(req) {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return { authenticated: false, user: null };
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    return { authenticated: false, user: null };
  }

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
