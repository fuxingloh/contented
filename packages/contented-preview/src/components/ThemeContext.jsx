import { createContext, useState, useEffect, useContext } from 'react';
import Script from 'next/script';

/*
let mQ = window.matchMedia('(prefers-color-scheme: dark)');
let dE = document.documentElement;
let dEC = dE.classList;

function update(savedTheme) {
  let theme = 'system'
  try {
    if (!savedTheme) {
      savedTheme = window.localStorage.theme
    }
    if (savedTheme === 'dark') {
      theme = 'dark'
      dEC.add('dark')
    } else if (savedTheme === 'light') {
      theme = 'light'
      dEC.remove('dark')
    } else if (mQ.matches) {
      dEC.add('dark')
    } else {
      dEC.remove('dark')
    }
  } catch {
    theme = 'light'
    dEC.remove('dark')
  }
  return theme
}

function updateWT(savedTheme) {
  update(savedTheme)
  dEC.add('[&_*]:!transition-none')
  window.setTimeout(() => {
    dEC.remove('[&_*]:!transition-none')
  }, 0)
}

dE.setAttribute('data-theme', update())

new MutationObserver(([{ oldValue }]) => {
  let newValue = dE.getAttribute('data-theme')
  if (newValue !== oldValue) {
    try {
      window.localStorage.setItem('theme', newValue)
    } catch {}
    updateWT(newValue)
  }
}).observe(dE, { attributeFilter: ['data-theme'], attributeOldValue: true })

mQ.addEventListener('change', updateWT)
window.addEventListener('storage', updateWT)
 */
const colorSchemeScript = `let mQ=window.matchMedia("(prefers-color-scheme: dark)"),dE=document.documentElement,dEC=dE.classList;function update(e){let t="system";try{e||(e=window.localStorage.theme),"dark"===e?(t="dark",dEC.add("dark")):"light"===e?(t="light",dEC.remove("dark")):mQ.matches?dEC.add("dark"):dEC.remove("dark")}catch{t="light",dEC.remove("dark")}return t}function updateWT(e){update(e),dEC.add("[&_*]:!transition-none"),window.setTimeout((()=>{dEC.remove("[&_*]:!transition-none")}),0)}dE.setAttribute("data-theme",update()),new MutationObserver((([{oldValue:e}])=>{let t=dE.getAttribute("data-theme");if(t!==e){try{window.localStorage.setItem("theme",t)}catch{}updateWT(t)}})).observe(dE,{attributeFilter:["data-theme"],attributeOldValue:!0}),mQ.addEventListener("change",updateWT),window.addEventListener("storage",updateWT);`;

const ThemeContext = createContext(undefined);

export function ThemeProvider(props) {
  const [theme, setTheme] = useState(props.theme);

  useEffect(() => {
    if (theme) {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      setTheme(document.documentElement.getAttribute('data-theme'));
    }
  }, [theme]);

  return (
    <>
      <ThemeContext.Provider value={{ theme, setTheme }}>{props.children}</ThemeContext.Provider>
      <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: colorSchemeScript }} />
    </>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
