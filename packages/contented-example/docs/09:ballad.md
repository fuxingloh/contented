---
title: Ballad of Engineering
---

```shell
npm i
```

## While at SaaS Team

### Engineer Write code

```shell
echo "function foo()" > bar.js
jest bar.js
```

### Engineer Write Documentation

```shell
contented write
echo "write about foo()" > bar.md

git commit -m "feat(packages): foo() is bar"
git push
```

### Git Workflow CI

```shell
jest --ci --coverage &&
  github update workflow['CI/Build'] = Success with 99%

contented build &&
  github update workflow['CI/Contented'] = Success
```

### Git Workflow CD

```shell
contented generate &&
  netlify deploy

contented build &&
  npm publish
```

## While at Product/Marketing Team

### Engineer Implement Page

```jsx
import { allDocuments as aDocs } from '@company/your-product-a';
import { allDocuments as bDocs } from '@company/your-product-b';

export async function getStaticProps({ params }) {
  const path = `/${params?.slug?.join('/') ?? ''}`;
  if (path.startsWith('/docs/a')) {
    return {
      props: {
        doc: aDocs.find((p) => p.path === path),
      },
    };
  }

  return {
    props: {
      doc: bDocs.find((p) => p.path === path),
    },
  };
}

export default function Page({ doc }) {
  return (
    <ContentProse>
      <h1>{doc.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: doc.body.html }} />
    </ContentProse>
  );
}
```

### Dependabot

```shell
git commit -m "bump(deps): bump @your/documentation from 0.0.0 to 0.0.1"
git push
github create pr

contented generate
  && netlify deploy preview
```

### Engineer Review Changes

```shell
github open pr
github click Netlify Preview
github lgtm
```
