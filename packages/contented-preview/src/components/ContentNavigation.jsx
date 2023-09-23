import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Pipelines } from '../../../../index.js';

export function computeContentSections(items) {
  const sections = [];

  items.forEach((item) => {
    const prev = sections[sections.length - 1];
    if (isEqual(prev?.sections, item.sections)) {
      prev.items.push(item);
    } else {
      sections.push({ sections: item.sections, items: [item] });
    }
  });

  return sections;
}

export default function ContentNavigation({ sections, className }) {
  const router = useRouter();
  const pipelines = Object.entries(Pipelines);

  return (
    <nav className={className}>
      <ul role="list" className="space-y-6 text-[15px]">
        {sections.map((section) => {
          const folderName = section.sections.join(' / ');
          return (
            <li key={folderName}>
              {folderName && (
                <h2 className="font-display mb-3 font-medium text-slate-900/40 dark:text-white/40">{folderName}</h2>
              )}

              <ul
                role="list"
                className={clsx('mb-3 space-y-3', {
                  'border-l-2 border-slate-200 dark:border-slate-800': folderName,
                })}
              >
                {section.items?.map((link) => {
                  const linkPath = `/${link.type.toLowerCase()}${link.path}`;
                  const isCurrentPath = linkPath === router.asPath || router.asPath + '/' === linkPath;

                  return (
                    <li key={link.fileId} className="relative flex h-6 items-center">
                      <Link
                        href={linkPath}
                        className={clsx('truncate', {
                          'block w-full cursor-pointer truncate pl-3.5 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1 before:w-1':
                            folderName,
                          'text-primary-500 before:bg-primary-500 font-semibold': isCurrentPath,
                          'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300':
                            !isCurrentPath,
                        })}
                      >
                        {link?.fields.title ?? linkPath}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>

      {pipelines.length > 1 && (
        <div className="mt-12 md:hidden">
          <div className="border-t-2 border-slate-100 py-2 text-sm font-medium text-slate-900/60 dark:border-slate-800 dark:text-white/60">
            Collections
          </div>
          <div className="mt-1 flex gap-4">
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
                      'bg-slate-100 text-slate-700',
                      'dark:bg-slate-800 dark:text-slate-400',
                    )}
                  >
                    {type}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
