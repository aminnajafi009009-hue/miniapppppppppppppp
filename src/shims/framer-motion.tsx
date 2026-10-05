import React from 'react';

export type Variants = Record<string, any>;
export type HTMLMotionProps<T extends keyof JSX.IntrinsicElements> = any;

const OMIT = new Set(['initial','animate','exit','transition','variants','whileTap','whileHover','whileInView','viewport','layoutId','layout','drag','dragConstraints']);

function cleanProps(props: any) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(props || {})) {
    if (k === 'children' || !OMIT.has(k)) out[k] = v;
  }
  return out;
}

function make(tag: string) {
  return function MotionComponent(props: any) {
    const finalProps = cleanProps(props);
    return React.createElement(tag, finalProps, props?.children);
  };
}

export const motion: any = new Proxy({}, {
  get(_target, prop: string) {
    return make(prop);
  },
});

export function AnimatePresence(props: any) {
  return props?.children ?? null;
}
