import type { Metadata } from 'next';
import Link from 'next/link';
import { DESCRIPTIONS, KEYWORDS, generatePageMetadata } from '@/lib/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'ScrumApp | Retrospectivas em Tempo Real',
  description: DESCRIPTIONS.root,
  keywords: [
    ...KEYWORDS.primary,
    ...KEYWORDS.features,
    ...KEYWORDS.audience,
    'retro online',
    'ferramenta scrum brasil',
    'retro free',
    'retrospectiva colaborativa',
    'ferramenta ágil',
  ],
  path: '/',
});

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'A ferramenta é só para retrospectiva?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não. A proposta é ser uma ferramenta Scrum geral para cerimônias e rotinas ágeis. No momento, o módulo disponível em produção é o de retrospectiva.',
      },
    },
    {
      '@type': 'Question',
      name: 'A ferramenta funciona para times remotos e presenciais?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. Ela foi pensada para retrospectivas em time distribuído ou no escritório, com colaboração ao vivo, organização visual e priorização por votos.',
      },
    },
    {
      '@type': 'Question',
      name: 'A retrospectiva é colaborativa em tempo real?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O board atualiza em tempo real para todo o time, com suporte a criação de cards, votação e organização colaborativa.',
      },
    },
  ],
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Ferramenta Scrum para times ágeis com retrospectivas em tempo real
        </h1>
        <p className="mt-4 text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl">
          O Scrum App evolui como uma plataforma de Scrum geral. Hoje, o módulo disponível é o de retrospectiva, com criação de boards, cards, colunas, votação e colaboração em tempo real.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
          >
            Entrar
          </Link>
          <Link
            href="/retro"
            className="inline-flex items-center justify-center rounded-md px-5 py-2.5 text-sm font-medium border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Ver retrospectivas
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl font-semibold">Funcionalidades principais</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Disponível agora: módulo de retrospectiva. Novos módulos Scrum serão adicionados gradualmente.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <article className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
            <h3 className="font-semibold">Boards e colunas flexíveis</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Crie retrospectivas por sprint, organize colunas conforme o ritual do time e mova cards com facilidade.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
            <h3 className="font-semibold">Colaboração em tempo real</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Todo o board é sincronizado ao vivo para o time inteiro, ideal para dinâmicas remotas e híbridas.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
            <h3 className="font-semibold">Modo anônimo</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Incentive feedback honesto em retrospectivas com publicação sem identificação de autor.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
            <h3 className="font-semibold">Blur mode</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Reduza viés durante brainstorm ocultando cards até o momento ideal de discussão.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
            <h3 className="font-semibold">Votação e colaboração</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Priorize ações com votação por usuário e atualizações em tempo real no board.
            </p>
          </article>
          <article className="rounded-xl border border-gray-200 dark:border-gray-700 p-5 bg-white dark:bg-gray-800">
            <h3 className="font-semibold">Acesso simples para o time</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Entre com Google ou como convidado para acelerar a participação sem fricção no início da cerimônia.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
