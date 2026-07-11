import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Solo interceptamos y protegemos el portal de faculty-admin
  if (path.startsWith('/faculty-admin') && !path.startsWith('/faculty-admin/login')) {
    const sessionCookie = request.cookies.get('session')?.value;
    const session = await decrypt(sessionCookie);

    if (!session || session.role !== 'tenant_admin') {
      return NextResponse.redirect(new URL('/faculty-admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/faculty-admin/:path*'],
}
