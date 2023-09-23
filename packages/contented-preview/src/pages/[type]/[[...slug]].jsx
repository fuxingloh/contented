// noinspection ES6PreferShortImport
import clsx from 'clsx';
import mermaid from 'mermaid';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import { Index } from '../../../../index.js';
import ContentHeadings from '../../components/ContentHeadings';
import ContentNavigation, { computeContentSections } from '../../components/ContentNavigation';
import ContentProse from '../../components/ContentProse';
import { useMenu } from '../../components/MenuContext';
import { useTheme } from '../../components/ThemeContext';

export async function getStaticPaths() {
  return {
    paths: Index.map((file) => {
      return `/${file.type.toLowerCase()}${file.path}`;
    }),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const path = `/${params?.slug?.join('/') ?? ''}`;
  const ContentIndex = Index.find((file) => {
    return file.path === path && file.type.toLowerCase() === params?.type;
  });
  const Content = require(`../../../../${ContentIndex.type}/${ContentIndex.fileId}.json`);
  const TypeCollection = require(`../../../../${ContentIndex.type}/index.json`);

  return {
    props: {
      content: Content,
      sections: computeContentSections(TypeCollection),
    },
  };
}

export default function IndexPage({ content, sections }) {
  const siteTitle = getSiteTitle(content);
  const canonicalUrl = `${process.env.CONTENTED_PREVIEW_SITE_URL}${content.path}`;
  const description = content?.description;

  const { theme } = useTheme();
  const router = useRouter();
  const { isOpen } = useMenu();

  mermaid.initialize({ theme, startOnLoad: false });

  function setCodeblockGroupLanguage(language) {
    function getLanguageMetadata(element) {
      const dataGroups = element.querySelectorAll('nav')[0]?.getAttribute('data-groups');
      if (!dataGroups) {
        return;
      }
      const parsed = JSON.parse(dataGroups);
      return parsed.find((group) => group.language === language) ?? parsed[0];
    }

    document.querySelectorAll('.prose div.codeblock-group').forEach((codeblockGroup) => {
      const group = getLanguageMetadata(codeblockGroup);
      if (!group) {
        return;
      }

      codeblockGroup.querySelectorAll('.codeblock-language-selected')[0].innerHTML = group.language;
      codeblockGroup.querySelectorAll('.codeblock-filename')[0].innerHTML = group.filename;
      codeblockGroup.querySelectorAll('.codeblock-header').forEach((header) => {
        header.style.display = header.getAttribute('data-language') !== language ? 'none' : 'block';
      });
    });
  }

  useEffect(() => {
    mermaid.init();

    document.querySelectorAll('.codeblock-language-options button').forEach((button) => {
      button.onclick = () => setCodeblockGroupLanguage(button.innerHTML);
    });
  }, [router.asPath, theme]);

  return (
    <>
      <Head>
        <title key="title">{siteTitle}</title>
        <meta key="og:title" name="og:title" content={siteTitle} />
        <link key="canonical" rel="canonical" href={canonicalUrl} />
        <meta key="og:url" name="og:url" content={canonicalUrl} />

        {description && (
          <>
            <meta key="description" name="description" content={description} />
            <meta key="og:description" name="og:description" content={description} />
          </>
        )}
      </Head>

      <div className="max-w-8xl relative mx-auto flex justify-center px-4 sm:px-6 lg:px-8">
        <div
          className={clsx('relative flex-none', {
            block: isOpen,
            'hidden lg:block': !isOpen,
          })}
        >
          <div className="absolute bottom-0 right-0 top-0 hidden w-px dark:block lg:bg-slate-800" />
          <div className="absolute inset-y-0 right-0 w-[50vw] dark:hidden lg:bg-slate-50" />
          <div className="sticky top-[3.25rem] -ml-0.5 h-[calc(100vh-3.25rem)] overflow-y-auto py-12">
            <ContentNavigation sections={sections} className="w-64 pr-8 xl:w-72 xl:pr-16" />
          </div>
        </div>
        <div
          className={clsx('min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16', {
            hidden: isOpen,
          })}
        >
          <article>
            <ContentProse>
              <div dangerouslySetInnerHTML={{ __html: content.html + `<!--${theme}-->` }} />
            </ContentProse>
          </article>
        </div>

        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            <ContentHeadings headings={content.headings} fields={content.fields} />
          </nav>
        </div>
      </div>
    </>
  );
}

function getSiteTitle(content) {
  if (!content.fields.title) {
    return process.env.CONTENTED_PREVIEW_SITE_NAME;
  }

  if (content.fields.title === process.env.CONTENTED_PREVIEW_SITE_NAME) {
    return content.fields.title;
  }

  return `${content.fields.title} | ${process.env.CONTENTED_PREVIEW_SITE_NAME}`;
}
