import { Metadata } from 'next';

const TITLE_PREFIX = 'ScrumApp | ';

function withTitlePrefix(title: string): string {
  return title.startsWith(TITLE_PREFIX) ? title : `${TITLE_PREFIX}${title}`;
}

// Configuração base da aplicação
export const APP_CONFIG = {
  name: 'Scrum App',
  shortName: 'ScrumApp',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  description: 'Scrum App: Ferramenta Scrum para times ágeis. Atualmente com módulo de retrospectiva disponível, incluindo boards, colunas, cards, votação e colaboração em tempo real.',
  locale: 'pt_BR',
  language: 'pt-BR',
};

// Descrições específicas para diferentes páginas
export const DESCRIPTIONS = {
  root: 'Scrum App: Ferramenta Scrum para times ágeis. Atualmente com módulo de retrospectiva disponível, incluindo boards, colunas, cards, votação e colaboração em tempo real.',
  retroList: 'Crie e gerencie retrospectivas de sprint com votação, cards arrastáveis e colaboração em tempo real. Organize cerimônias de melhoria contínua para seu time ágil.',
  login: 'Entre com Google ou como convidado para acessar retrospectivas Scrum colaborativas em tempo real.',
  home: 'Acesse retrospectivas, planning poker e ferramentas de cerimônias ágeis para seu time Scrum.',
};

// Keywords agrupadas por categoria
export const KEYWORDS = {
  primary: [
    'retrospectiva scrum',
    'retrospectiva ágil',
    'ferramenta retrospectiva',
    'sprint retrospective',
  ],
  features: [
    'votação retrospectiva',
    'modo anônimo',
    'colaboração tempo real',
    'blur mode',
    'drag and drop',
  ],
  audience: [
    'times ágeis brasil',
    'equipes scrum',
    'gestão ágil',
    'scrum master',
    'melhoria contínua',
  ],
};

// Combinar todas as keywords
export const ALL_KEYWORDS = [
  ...KEYWORDS.primary,
  ...KEYWORDS.features,
  ...KEYWORDS.audience,
];

// Configuração padrão de Open Graph
export const DEFAULT_OPEN_GRAPH = {
  type: 'website' as const,
  locale: APP_CONFIG.locale,
  siteName: APP_CONFIG.name,
  images: [
    {
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: `${APP_CONFIG.name} - Retrospectivas Ágeis`,
    },
  ],
};

// Configuração padrão do Twitter Card
export const DEFAULT_TWITTER = {
  card: 'summary_large_image' as const,
  images: ['/twitter-image.png'],
};

// Helper function para gerar metadata de página
export function generatePageMetadata({
  title,
  description,
  keywords,
  path = '/',
  noIndex = false,
  images,
}: {
  title: string;
  description: string;
  keywords?: string[];
  path?: string;
  noIndex?: boolean;
  images?: Array<{ url: string; width: number; height: number; alt: string }>;
}): Metadata {
  const url = `${APP_CONFIG.url}${path}`;
  const pageImages = images || DEFAULT_OPEN_GRAPH.images;
  const normalizedTitle = withTitlePrefix(title);

  return {
    title: {
      absolute: normalizedTitle,
    },
    description,
    keywords: keywords || ALL_KEYWORDS,
    openGraph: {
      ...DEFAULT_OPEN_GRAPH,
      title: normalizedTitle,
      description,
      url,
      images: pageImages,
    },
    twitter: {
      ...DEFAULT_TWITTER,
      title: normalizedTitle,
      description,
      images: pageImages.map((img) => img.url),
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

// Gerador de dados estruturados JSON-LD para SoftwareApplication
export function generateSoftwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
    featureList: [
      'Colaboração em tempo real via WebSocket',
      'Modo blur para privacidade durante escrita',
      'Modo anônimo para feedback honesto',
      'Sistema de votação com até 5 votos por usuário',
      'Drag-and-drop de cards e colunas personalizáveis',
      'Múltiplas colunas configuráveis (até 4)',
      'Compartilhamento de boards via link',
      'Acesso como convidado sem necessidade de cadastro',
    ],
    inLanguage: APP_CONFIG.language,
    audience: {
      '@type': 'Audience',
      audienceType: 'Times Ágeis e Scrum Masters',
    },
  };
}
