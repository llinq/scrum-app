import { Metadata } from 'next';
import LoginForm from '@/components/LoginForm';
import { DESCRIPTIONS } from '@/lib/metadata';

export const metadata: Metadata = {
  title: 'Login - Acesse suas Retrospectivas',
  description: DESCRIPTIONS.login,
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginForm />;
}
