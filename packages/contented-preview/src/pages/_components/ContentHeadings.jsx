import clsx from 'clsx';
import Link from 'next/link';

export default function ContentHeadings(props) {
  return (
    <>
      {props.tags?.length > 0 && (
        <>
          <h2 id="tags-title" className="font-display text-sm font-medium text-slate-900 dark:text-white">
            Tags
          </h2>
          <div className="mb-6 mt-4">
            <div className="-mx-1.5 -my-1 flex flex-wrap">
              {props.tags.map((tag) => (
                <div key={tag} className="px-1.5 py-1">
                  <span
                    className={clsx(
                      'rounded px-2 py-1 text-sm font-medium',
                      'bg-slate-100 text-slate-700',
                      'dark:bg-slate-800 dark:text-slate-400',
                    )}
                  >
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {props.headings.length > 0 && (
        <>
          <h2 id="on-this-page-title" className="font-display text-sm font-medium text-slate-900 dark:text-white">
            On this page
          </h2>
          <ol role="list" className="mt-4 space-y-3 text-sm">
            {props.headings.map((heading) => (
              <li key={heading.headingId}>
                <h3 className="font-normal text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
                  <Link href={`#${heading.headingId}`}>{heading.title}</Link>
                </h3>
                {heading.children.length > 0 && (
                  <ol role="list" className="mt-2 space-y-3 pl-5 text-slate-500 dark:text-slate-400">
                    {heading.children.map((innerHeading) => (
                      <li key={innerHeading.headingId} className="hover:text-slate-600 dark:hover:text-slate-300">
                        <Link href={`#${innerHeading.headingId}`}>{innerHeading.title}</Link>
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
