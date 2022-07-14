import { ComputedFields, LocalDocument } from "@contentlayer/source-files";
import { Content, Parent, Root } from "hast";
import { toString } from "hast-util-to-string";
import rehypeParse from "rehype-parse";
import { unified } from "unified";

export interface ContentHeading {
  id: string;
  depth: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
  children: ContentHeading[];
}

function mergeHeadings(headings: ContentHeading[]): ContentHeading[] {
  const root: ContentHeading[] = [];
  headings.forEach((heading) => {
    const previous = root[root.length - 1];
    if (!previous) {
      root.push(heading);
      return;
    }

    if (previous.depth < heading.depth) {
      previous.children.push(heading);
    } else {
      root.push(heading);
    }
  });

  root.forEach((contentHeading) => {
    // eslint-disable-next-line no-param-reassign
    contentHeading.children = mergeHeadings(contentHeading.children);
  });

  return root;
}

function remarkRehead(this: any) {
  function collectHeadings(
    node: Parent,
    headings: ContentHeading[] = []
  ): ContentHeading[] {
    node?.children?.forEach((child: Content) => {
      if (child.type === "element") {
        // eslint-disable-next-line default-case
        switch (child.tagName) {
          case "h1":
          case "h2":
          case "h3":
          case "h4":
          case "h5":
          case "h6":
            headings.push({
              depth: Number.parseInt(child.tagName.substring(1), 10) as any,
              id: (child.properties?.id as string) ?? "",
              title: toString(child),
              children: [],
            });
        }

        collectHeadings(child as Parent, headings);
      }
    });

    return headings;
  }

  this.Compiler = (node: Root): ContentHeading[] => {
    const headings = collectHeadings(node);
    return mergeHeadings(headings);
  };
}

export function computeContentHeadings(): ComputedFields[string] {
  return {
    type: "json",
    description: "The headings of the content.",
    async resolve(doc: LocalDocument): Promise<ContentHeading[]> {
      const parsed = await unified()
        .use(rehypeParse)
        .use(remarkRehead)
        .process(doc.body.html);
      return parsed.result as ContentHeading[];
    },
  };
}
