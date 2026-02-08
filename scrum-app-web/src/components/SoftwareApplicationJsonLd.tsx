import { generateSoftwareApplicationSchema } from '@/lib/metadata';

export function SoftwareApplicationJsonLd() {
  const schema = generateSoftwareApplicationSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
