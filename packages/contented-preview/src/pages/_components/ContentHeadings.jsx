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
            {props.headings.map((heading1) => (
              <li key={heading1.headingId} className="font-normal text-slate-500 dark:text-slate-400">
                <div className="hover:text-slate-700 dark:hover:text-slate-300">
                  <Link href={`#${heading1.headingId}`}>{heading1.title}</Link>
                </div>
                {heading1.children.length > 0 && (
                  <ol role="list" className="mt-2 space-y-3 pl-4">
                    {heading1.children.map((heading2) => (
                      <li key={heading2.headingId}>
                        <div className="hover:text-slate-700 dark:hover:text-slate-300">
                          <Link href={`#${heading2.headingId}`}>{heading2.title}</Link>
                        </div>
                        {heading2.children.length > 0 && (
                          <ol role="list" className="mt-2 space-y-3 pl-4">
                            {heading2.children.map((heading3) => (
                              <li key={heading3.headingId}>
                                <div className="hover:text-slate-700 dark:hover:text-slate-300">
                                  <Link href={`#${heading3.headingId}`}>{heading3.title}</Link>
                                </div>
                              </li>
                            ))}
                          </ol>
                        )}
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
