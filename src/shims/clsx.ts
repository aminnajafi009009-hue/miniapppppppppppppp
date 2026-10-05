export default function clsx(...args: any[]): string {
  const out: string[] = [];
  const push = (value: any) => {
    if (!value) return;
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value));
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(push);
      return;
    }
    if (typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) {
        if (v) out.push(k);
      }
    }
  };
  args.forEach(push);
  return out.join(' ');
}
