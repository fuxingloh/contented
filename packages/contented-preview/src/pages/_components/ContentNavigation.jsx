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
          const path = section.sections.join(' / ');
          return (
            <li key={path}>
              {path && <h2 className="font-display mb-3 font-medium text-slate-900/40 dark:text-white/40">{path}</h2>}

              <ul
                role="list"
                className={clsx('mb-3 space-y-3', {
                  'border-l-2 border-slate-200 dark:border-slate-800': path,
                })}
              >
                {section.items?.map((link) => (
                  <li key={link.path} className="relative">
                    <Link
                      href={link.path}
                      className={clsx({
                        'block w-full cursor-pointer truncate pl-3 before:pointer-events-none before:absolute before:inset-y-0 before:-left-1 before:w-1':
                          path,
                        'font-medium': !path,
                        'text-primary-500 before:bg-primary-500 font-semibold': link.path === router.asPath,
                        'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300':
                          link.path !== router.asPath,
                      })}
                    >
                      {link?.fields.title ?? link.path}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
