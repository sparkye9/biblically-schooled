/** Service worker registration (offline support). */

export async function registerServiceWorker() {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return
  if (process.env.NODE_ENV !== 'production') return
  try {
    return await navigator.serviceWorker.register('/sw.js', { scope: '/' })
  } catch {
    /* offline support is optional */
  }
}
