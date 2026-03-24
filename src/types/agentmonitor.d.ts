declare module '@agentmonitor/sdk' {
  export class AgentMonitor {
    constructor(accessToken: string);
    track(request: {
      path: string;
      query: string;
      method: string;
      headers: Record<string, string>;
    }): void;
  }
}
