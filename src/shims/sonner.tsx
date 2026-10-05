import React from 'react';

type ToastFn = (message: string) => void;
const emit = (type: string, message: string) => {
  try { console[type === 'error' ? 'error' : 'log'](`[toast:${type}] ${message}`); } catch {}
};

export const toast: Record<string, ToastFn> = {
  success: (message: string) => emit('success', message),
  error: (message: string) => emit('error', message),
  info: (message: string) => emit('info', message),
  warning: (message: string) => emit('warning', message),
  message: (message: string) => emit('message', message),
};

export function Toaster(_props: any): any {
  return null;
}
