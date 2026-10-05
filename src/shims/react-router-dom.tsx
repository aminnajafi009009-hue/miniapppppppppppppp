import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

type LocationLike = { pathname: string; state?: any };
type NavigateOptions = { replace?: boolean; state?: any };

type RouterCtx = {
  location: LocationLike;
  navigate: (to: string | number, options?: NavigateOptions) => void;
};

const RouterContext = createContext<RouterCtx | null>(null);
const OutletContext = createContext<any>(null);

function currentLocation(): LocationLike {
  return {
    pathname: window.location.pathname || '/',
    state: (window.history.state && (window.history.state as any).__rr_state) || undefined,
  };
}

export function BrowserRouter({ children }: { children?: any }) {
  const [location, setLocation] = useState<LocationLike>(currentLocation());

  useEffect(() => {
    const onPop = () => setLocation(currentLocation());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (to: string | number, options?: NavigateOptions) => {
    if (typeof to === 'number') {
      window.history.go(to);
      setTimeout(() => setLocation(currentLocation()), 0);
      return;
    }
    const replace = options?.replace ?? false;
    const state = { __rr_state: options?.state };
    if (replace) window.history.replaceState(state, '', to);
    else window.history.pushState(state, '', to);
    setLocation({ pathname: to, state: options?.state });
  };

  const value = useMemo(() => ({ location, navigate }), [location]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useNavigate() {
  const ctx = useContext(RouterContext);
  return ctx ? ctx.navigate : (() => {});
}

export function useLocation() {
  const ctx = useContext(RouterContext);
  return ctx ? ctx.location : { pathname: '/', state: undefined };
}

export function NavLink({ to, end, className, children, ...props }: any) {
  const { location, navigate } = useContext(RouterContext) || { location: { pathname: '/' }, navigate: () => {} };
  const isActive = end ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + '/');
  const computedClassName = typeof className === 'function' ? className({ isActive }) : className;
  const content = typeof children === 'function' ? children({ isActive }) : children;
  return (
    <a
      href={to}
      className={computedClassName}
      onClick={(e) => {
        e.preventDefault();
        navigate(to);
      }}
      {...props}
    >
      {content}
    </a>
  );
}

export function Route(_props: any) {
  return null;
}

function matchRoutes(children: any, pathname: string): any {
  const list = React.Children.toArray(children) as any[];
  for (const child of list) {
    if (!React.isValidElement(child)) continue;
    const props = child.props || {};
    const path = props.path as string | undefined;
    const element = props.element ?? null;
    const nested = props.children;

    if (path) {
      if (path === pathname) return element;
      continue;
    }

    if (nested) {
      const matchedChild = matchRoutes(nested, pathname);
      if (matchedChild != null) {
        if (element != null) {
          return <OutletContext.Provider value={matchedChild}>{element}</OutletContext.Provider>;
        }
        return matchedChild;
      }
    } else if (element != null) {
      return element;
    }
  }
  return null;
}

export function Routes({ children }: { children?: any }) {
  const location = useLocation();
  return matchRoutes(children, location.pathname);
}

export function Outlet() {
  return useContext(OutletContext);
}
