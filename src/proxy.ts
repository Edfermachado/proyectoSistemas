import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protegemos el portal de faculty-admin
  if (path.startsWith('/faculty-admin')) {
    const sessionCookie = request.cookies.get('session')?.value;
    const session = await decrypt(sessionCookie);

    const allowedRoles = ['tenant_admin', 'event_manager', 'access_control'];

    if (!session || !allowedRoles.includes(session.role as string)) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/faculty-admin/:path*'],
}
