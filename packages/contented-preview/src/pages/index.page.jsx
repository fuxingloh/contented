import { Index } from '../../../index.js';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function IndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${Index[0].type.toLowerCase()}${Index[0].path}`);
  }, []);

  return <></>;
}
