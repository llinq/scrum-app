import { Metadata } from 'next';
import { generatePageMetadata, DESCRIPTIONS, KEYWORDS } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Minhas Retrospectivas - Gerencie suas Retros',
  description: DESCRIPTIONS.retroList,
  keywords: [...KEYWORDS.primary, ...KEYWORDS.audience, 'gestão ágil', 'sprint review', 'melhoria contínua'],
  path: '/retro',
  noIndex: false,
});

export default function RetroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
