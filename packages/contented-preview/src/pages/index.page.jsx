import { Index } from '../../../index.js';

export async function getStaticProps({ params }) {
  return {
    redirect: {
      destination: `/${Index[0].type.toLowerCase()}${Index[0].path}`,
    },
  };
}

export default function IndexPage() {
  return <></>;
}
