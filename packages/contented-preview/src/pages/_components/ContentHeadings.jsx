import clsx from 'clsx';
import Link from 'next/link';

export default function ContentHeadings(props) {
  return (
    <>
      {props.fields.editOnGitHubLink && (
        <div className="mb-6 flex">
          <a
            href={props.fields.editOnGitHubLink}
            target="_blank"
            className={clsx(
              'flex items-center rounded px-4 py-2.5 text-sm font-medium',
              'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-800',
              'dark:bg-slate-800 dark:text-slate-400 hover:dark:bg-slate-700 hover:dark:text-slate-200',
            )}
          >
            <span>Edit on GitHub</span>
            <svg viewBox="0 0 24 24" className="-mr-1 ml-2 h-5 w-5">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>
        </div>
      )}
      {props.fields.tags?.length > 0 && (
        <>
          <h2 id="tags-title" className="font-display text-sm font-medium text-slate-900 dark:text-white">
            Tags
          </h2>
          <div className="mb-6 mt-4">
            <div className="-mx-1.5 -my-1 flex flex-wrap">
              {props.fields.tags.map((tag) => (
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
