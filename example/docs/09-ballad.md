# Ballad of Engineering

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
import { Index as aDocs } from '@company/your-product-a';
import { Index as bDocs } from '@company/your-product-b';

async function findContent(path) {
  let content = aDocs.find((file) => file.path === path);
  if (content) {
    return require(`@company/your-product-a/${content.type}/${content.id}.json`);
  }

  content = bDocs.find((file) => file.path === path);
  if (content) {
    return require(`@company/your-product-b/${content.type}/${content.id}.json`);
  }
}

export async function getStaticProps({ params }) {
  const path = `/${params?.slug?.join('/') ?? ''}`;
  return {
    props: {
      doc: await findContent(path),
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
github click Vercel Preview
github lgtm
```
