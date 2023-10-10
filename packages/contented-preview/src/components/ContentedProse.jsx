import clsx from 'clsx';
import Link from 'next/link';
import { Parser, ProcessNodeDefinitions } from 'html-to-react';
import Image from 'next/image';
import { join } from 'path';

const HtmlToReactParser = Parser();
const processNodeDefinitions = ProcessNodeDefinitions();

export default function ContentedProse({ className, html, type, ...props }) {
  const parsed = HtmlToReactParser.parseWithInstructions(html, () => true, [
    {
      replaceChildren: false,
      shouldProcessNode: (node) => node.name === 'a',
      processNode: (node, children) => {
        const { href, tabindex, ...props } = node.attribs;
        return (
          <Link href={href} tabIndex={tabindex} {...props}>
            {children}
          </Link>
        );
      },
    },
    {
      replaceChildren: false,
      shouldProcessNode: (node) => node.name === 'img',
      processNode: (node) => {
        const { src, ...props } = node.attribs;
        return <Image unoptimized src={join('../../../', type, src)} width={100} height={100} {...props} />;
      },
    },
    {
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode,
    },
  ]);

  return (
    <article
      className={clsx(
        className,
        'prose prose-slate dark:prose-invert max-w-none dark:text-slate-400',
        // headings
        'prose-headings:scroll-mt-28 lg:prose-headings:scroll-mt-[8.5rem]',
        // lead
        'prose-lead:text-slate-500 dark:prose-lead:text-slate-400',
        // links
        'prose-a:font-semibold prose-a:text-rose-500 dark:prose-a:text-rose-400',
        // link underline
        'prose-a:no-underline hover:prose-a:underline ',
        // code
        'prose-code:before:content-none prose-code:after:content-none',
        // hr
        'dark:prose-hr:border-slate-800',
      )}
      {...props}
    >
      {parsed}
    </article>
  );
}
