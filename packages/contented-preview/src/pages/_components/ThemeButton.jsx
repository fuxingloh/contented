import { MoonIcon, SunIcon } from '@heroicons/react/outline';
import { useTheme } from './ThemeContext';

export default function ThemeButton(props) {
  const { setTheme } = useTheme();

  return (
    <div {...props}>
      <button className="flex items-center">
        <SunIcon className="hidden h-6 w-6 [[data-theme=light]_&]:block" onClick={() => setTheme('dark')} />
        <MoonIcon className="hidden h-6 w-6 [[data-theme=dark]_&]:block" onClick={() => setTheme('light')} />
        <SunIcon className="hidden h-6 w-6 [:not(.dark)[data-theme=system]_&]:block" onClick={() => setTheme('dark')} />
        <MoonIcon className="hidden h-6 w-6 [.dark[data-theme=system]_&]:block" onClick={() => setTheme('light')} />
      </button>
    </div>
  );
}
