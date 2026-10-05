import { useSyncExternalStore } from 'react';

export function create<T>(initializer: (set: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void, get: () => T) => T) {
  let state: T;
  const listeners = new Set<() => void>();
  const get = () => state;
  const set = (partial: any, replace = false) => {
    const nextPartial = typeof partial === 'function' ? partial(state) : partial;
    state = replace ? nextPartial : { ...(state as any), ...(nextPartial as any) };
    listeners.forEach((l) => l());
  };
  state = initializer(set, get);
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const useStore = () => useSyncExternalStore(subscribe, get, get);
  (useStore as any).getState = get;
  (useStore as any).setState = set;
  (useStore as any).subscribe = subscribe;
  return useStore as any;
}
