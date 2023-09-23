import { Index } from '../../../index.js';
import { redirect } from 'next/navigation';

export default function Page() {
  return redirect(`/${Index[0].type.toLowerCase()}${Index[0].path}`);
}
