import clsx from 'clsx';
import isEqual from 'lodash/isEqual';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function computeContentSections(items) {
  // eslint-disable-next-line no-underscore-dangle
  items.sort((a, b) => a._id.localeCompare(b._id));
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
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-9">
        {sections.map((section) => {
          const path = section.sections.join('/');
          return (
            <li key={path}>
              {path && <h2 className="font-display font-medium text-slate-900 dark:text-white">{path}</h2>}

              <ul
                role="list"
                className={clsx('mt-2 space-y-2 lg:mt-4 lg:space-y-4', {
                  'border-l-2 border-slate-100 dark:border-slate-800 lg:border-slate-200': path,
                })}
              >
                {section.items?.map((link) => (
                  <li key={link.path} className="relative">
                    <Link href={link.path}>
                      <a
                        className={clsx({
                          'block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full':
                            path,
                          'font-medium': !path,
                          'text-primary-500 before:bg-primary-500 font-semibold': link.path === router.asPath,
                          'text-slate-500 before:hidden before:bg-slate-300 hover:text-slate-600 hover:before:block dark:text-slate-400 dark:before:bg-slate-700 dark:hover:text-slate-300':
                            link.path !== router.asPath,
                        })}
                      >
                        {link?.title ?? link.path}
                      </a>
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
