import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/metadata';

// Since retro boards are private and auth-protected, we use static metadata with noindex
// Dynamic metadata would require server-side API calls which are complex with the current auth setup
export const metadata: Metadata = generatePageMetadata({
  title: 'Retrospectiva',
  description: 'Participe de retrospectivas colaborativas em tempo real. Adicione cards, vote nas ideias e colabore com seu time usando modo blur e anônimo.',
  noIndex: true, // Private boards should not be indexed
  path: '/retro/',
});

export default function RetroDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
