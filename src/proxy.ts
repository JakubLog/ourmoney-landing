import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from '@/i18n/routing';
import { AgentMonitor } from '@agentmonitor/sdk';

const intlMiddleware = createMiddleware(routing);

// Lazy-init AgentMonitor — zero cost if token is not set
let agentMonitor: AgentMonitor | null = null;

function getAgentMonitor() {
  if (!agentMonitor) {
    const token = process.env.AGENT_MONITOR_TOKEN;
    if (!token) return null;
    agentMonitor = new AgentMonitor(token);
  }
  return agentMonitor;
}

export default function proxy(request: NextRequest) {
  // Fire-and-forget tracking — never blocks the response
  try {
    getAgentMonitor()?.track({
      path: request.nextUrl.pathname,
      query: request.nextUrl.search,
      method: request.method,
      headers: Object.fromEntries(request.headers),
    });
  } catch {
    // Silent fail — monitoring must never affect user experience
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // `og` wyjete swiadomie - generator obrazkow OG nie ma wersji jezykowych,
    // a middleware doklejalby mu prefiks locale i psul adresy
    '/((?!_next|_vercel|og|.*\\..*).*)',
    '/([\\w-]+)?/studio(.*)',
  ],
};
