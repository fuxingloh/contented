import { MoonIcon, SunIcon } from '@heroicons/react/24/outline';
import { useTheme } from './ThemeContext';

export default function ThemeButton(props) {
  const { setTheme } = useTheme();

  return (
    <div {...props}>
      <button className="flex items-center">
        <SunIcon className="hidden h-4 w-4 [[data-theme=light]_&]:block" onClick={() => setTheme('dark')} />
        <MoonIcon className="hidden h-4 w-4 [[data-theme=dark]_&]:block" onClick={() => setTheme('light')} />
        <SunIcon className="hidden h-4 w-4 [:not(.dark)[data-theme=system]_&]:block" onClick={() => setTheme('dark')} />
        <MoonIcon className="hidden h-4 w-4 [.dark[data-theme=system]_&]:block" onClick={() => setTheme('light')} />
      </button>
    </div>
  );
}
