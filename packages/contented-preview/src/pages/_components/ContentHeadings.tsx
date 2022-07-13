import { ContentHeading } from '@birthdayresearch/contented-processor/fields/headings';
import clsx from 'clsx';
import Link from 'next/link';

export default function ContentHeadings(props: { contentHeadings: ContentHeading[] }) {
  return (
    <>
      {props.contentHeadings.length > 0 && (
        <>
          <h2 id="on-this-page-title" className="font-display text-sm font-medium text-slate-900 dark:text-white">
            On this page
          </h2>
          <ol role="list" className="mt-4 space-y-3 text-sm">
            {props.contentHeadings.map((heading: ContentHeading) => (
              <li key={heading.id}>
                <h3>
                  <Link
                    href={`#${heading.id}`}
                    className={clsx(
                      'font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300',
                    )}
                  >
                    {heading.title}
                  </Link>
                </h3>
                {heading.children.length > 0 && (
                  <ol role="list" className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400">
                    {heading.children.map((innerHeading) => (
                      <li key={innerHeading.id}>
                        <Link href={`#${innerHeading.id}`} className="hover:text-slate-600 dark:hover:text-slate-300">
                          {innerHeading.title}
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </li>
            ))}
          </ol>
        </>
      )}
    </>
  );
}
