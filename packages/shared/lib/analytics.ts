export function trackEvent(eventName: string, properties?: Record<string, string>) {
  if (typeof window !== 'undefined' && 'va' in window) {
    // @ts-expect-error va is injected by Vercel Analytics
    window.va('event', { name: eventName, ...properties });
  }
}
