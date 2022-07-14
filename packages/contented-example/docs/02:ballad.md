---
title: Ballad of Engineering
---

```shell
npm i
```

## While at SaaS Team

### Engineering Write code

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

### Dependabot

```shell
git commit -m "bump(deps): bump @your/documentation from 0.0.0 to 0.0.1"
git push
github create pr

contented generate
  && netlify deploy preview
```

### Engineer

```shell
github open pr
github click Netlify Preview
github lgtm
```
