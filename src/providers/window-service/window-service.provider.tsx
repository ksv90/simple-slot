import { JSX, PropsWithChildren, useEffect, useState } from 'react';

import { WindowService, WindowServiceContext } from './window-service.context';

function getWindowService(): WindowService {
  const { innerWidth, innerHeight } = globalThis;
  const { matches } = window.matchMedia('(orientation: portrait)');
  return {
    innerWidth,
    innerHeight,
    orientation: matches ? 'portrait' : 'landscape',
    portrait: matches,
    landscape: !matches,
  };
}

export const WindowServiceProvider = (props: PropsWithChildren): JSX.Element => {
  const { children } = props;

  const [windowService, setWindowService] = useState(getWindowService());

  useEffect(() => {
    const resizeHandle = (): void => {
      setWindowService(getWindowService());
    };
    globalThis.addEventListener('resize', resizeHandle);
    return () => {
      globalThis.removeEventListener('resize', resizeHandle);
    };
  }, []);

  return <WindowServiceContext.Provider value={windowService}>{children}</WindowServiceContext.Provider>;
};
