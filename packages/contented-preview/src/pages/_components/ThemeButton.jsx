import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useTheme } from './ThemeContext';

export default function ThemeButton(props) {
  const { setTheme } = useTheme();

  return (
    <div {...props}>
      <button className="flex items-center">
        <SunIcon className="[[data-theme=light]_&]:block hidden h-6 w-6" onClick={() => setTheme('dark')} />
        <MoonIcon className="[[data-theme=dark]_&]:block hidden h-6 w-6" onClick={() => setTheme('light')} />
        <SunIcon className="[:not(.dark)[data-theme=system]_&]:block hidden h-6 w-6" onClick={() => setTheme('dark')} />
        <MoonIcon className="[.dark[data-theme=system]_&]:block hidden h-6 w-6" onClick={() => setTheme('light')} />
      </button>
    </div>
  );
}
