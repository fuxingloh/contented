import clsx from 'clsx';

export default function ContentProse({ as: Component = 'div', className, ...props }) {
  return (
    <Component
      className={clsx(
        className,
        'prose prose-slate dark:prose-invert max-w-none dark:text-slate-400',
        // headings
        'prose-headings:scroll-mt-28 lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
        // links
        'prose-a:font-semibold prose-a:text-primary-500 dark:prose-a:text-primary-400',
        // link underline
        'prose-a:no-underline hover:prose-a:underline ',
        // code
        'prose-code:before:content-none prose-code:after:content-none',
        // pre
        'prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg dark:prose-pre:bg-slate-800/60 dark:prose-pre:shadow-none dark:prose-pre:ring-1 dark:prose-pre:ring-slate-300/10',
        // hr
        'dark:prose-hr:border-slate-800',
      )}
      {...props}
    />
  );
}
