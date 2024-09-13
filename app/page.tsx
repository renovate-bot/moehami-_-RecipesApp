import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/recipe'); // Redirect to /article
  return null; 
}