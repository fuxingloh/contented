import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import { useRouter } from 'next/router';

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
                    <li key={link.fileId} className="relative">
                      <Link
                        href={linkPath}
                        className={clsx({
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
    </nav>
  );
}
