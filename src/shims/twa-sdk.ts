const noop = () => {};
const webApp = (globalThis as any)?.Telegram?.WebApp;

const fallback = {
  initData: '',
  ready: noop,
  expand: noop,
  close: noop,
  sendData: (data: string) => { try { console.log('[TWA sendData]', data); } catch {} },
  openLink: (url: string) => { try { window.open(url, '_blank', 'noopener,noreferrer'); } catch {} },
  openTelegramLink: (url: string) => { try { window.open(url, '_blank', 'noopener,noreferrer'); } catch {} },
  showAlert: (message: string) => { try { window.alert(message); } catch {} },
  setHeaderColor: noop,
  setBackgroundColor: noop,
  BackButton: { show: noop, hide: noop },
  HapticFeedback: { impactOccurred: noop, notificationOccurred: noop },
};

const sdk = webApp || fallback;
export default sdk;
