import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useEffect, useState } from 'react';

export default function ThemeButton(props) {
  const [selectedTheme, setSelectedTheme] = useState();

  useEffect(() => {
    if (selectedTheme) {
      document.documentElement.setAttribute('data-theme', selectedTheme);
    } else {
      const theme = document.documentElement.getAttribute('data-theme');
      setSelectedTheme(theme);
    }
  }, [selectedTheme]);

  return (
    <div {...props}>
      <button className="flex items-center">
        <SunIcon className="hidden h-6 w-6 [[data-theme=light]_&]:block" onClick={() => setSelectedTheme('dark')} />
        <MoonIcon className="hidden h-6 w-6 [[data-theme=dark]_&]:block" onClick={() => setSelectedTheme('light')} />
        <SunIcon
          className="hidden h-6 w-6 [:not(.dark)[data-theme=system]_&]:block"
          onClick={() => setSelectedTheme('dark')}
        />
        <MoonIcon
          className="hidden h-6 w-6 [.dark[data-theme=system]_&]:block"
          onClick={() => setSelectedTheme('light')}
        />
      </button>
    </div>
  );
}
