import { Bars3Icon, DocumentTextIcon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';

import { Pipelines } from '../../../../index.js';
import { useMenu } from './MenuContext';
import { useTheme } from './ThemeContext';

export default function Header() {
  const { isOpen, setIsOpen } = useMenu();
  const pipelines = Object.entries(Pipelines);

  return (
    <header className="sticky top-0 z-10 h-[3.25rem] border-b border-slate-200/60 bg-slate-50 dark:border-slate-300/10 dark:bg-slate-900 print:hidden">
      <nav className="max-w-8xl mx-auto h-full px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-full w-full items-center justify-between">
          <div className="flex">
            <div className="mr-4 flex lg:hidden">
              {isOpen ? (
                <button type="button" onClick={() => setIsOpen(false)} aria-label="Close navigation">
                  <XMarkIcon className="h-6 w-6" />
                </button>
              ) : (
                <button type="button" onClick={() => setIsOpen(true)} aria-label="Open navigation">
                  <Bars3Icon className="h-6 w-6" />
                </button>
              )}
            </div>

            <a href="/" className="flex items-center">
              <DocumentTextIcon className="text-primary-500 h-6 w-auto" />
              <h1 className="ml-2 font-semibold">{process.env.CONTENTED_PREVIEW_SITE_NAME}</h1>
            </a>

            {pipelines.length > 1 && (
              <div className="ml-6 hidden border-l border-slate-300/60 pl-4 dark:border-slate-300/10 md:flex">
                {pipelines.map(([type, pipeline]) => {
                  if (pipeline.collection[0] === undefined || pipeline.collection[0] === null) {
                    throw new Error(
                      `Pipeline type '${type}' cannot resolve its collection. Please check if contented.config.mjs is properly configured.`,
                    );
                  }
                  return (
                    <Link href={`/${type.toLowerCase()}${pipeline.collection[0].path}`} key={type}>
                      <div
                        className={clsx(
                          'rounded px-3 py-2 text-sm font-medium',
                          'text-slate-800 hover:bg-slate-200/50 hover:text-slate-900',
                          'dark:text-slate-400 hover:dark:bg-slate-800 dark:hover:text-slate-300',
                        )}
                      >
                        {type}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div>
              <ThemeButton />
            </div>
            <div>
              <GitHubButton className="h-6 w-auto" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

function GitHubButton(props) {
  return (
    <div {...props}>
      <a className="flex items-center" href={process.env.CONTENTED_PREVIEW_GITHUB_URL} target="_blank">
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      </a>
    </div>
  );
}

function ThemeButton(props) {
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
