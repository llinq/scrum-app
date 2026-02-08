import { Metadata } from 'next';
import { DESCRIPTIONS } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Dashboard - Suas Ferramentas Ágeis',
  description: DESCRIPTIONS.home,
  robots: {
    index: false,
    follow: false,
  },
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
