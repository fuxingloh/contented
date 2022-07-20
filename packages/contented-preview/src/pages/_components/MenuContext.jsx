import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';

const MenuContext = createContext(undefined);

export function MenuProvider(props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    function onRouteChange() {
      setIsOpen(false);
    }

    router.events.on('routeChangeComplete', onRouteChange);
    router.events.on('routeChangeError', onRouteChange);

    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
      router.events.off('routeChangeError', onRouteChange);
    };
  }, [router, isOpen]);

  return <MenuContext.Provider value={{ isOpen, setIsOpen }}>{props.children}</MenuContext.Provider>;
}

export function useMenu() {
  return useContext(MenuContext);
}
