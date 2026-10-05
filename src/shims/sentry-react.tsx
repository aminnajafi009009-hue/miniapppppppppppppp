import React from 'react';

export function init(_config?: any) {}

export function ErrorBoundary(props: { children?: any; fallback?: any }) {
  return props.children ?? props.fallback ?? null;
}
