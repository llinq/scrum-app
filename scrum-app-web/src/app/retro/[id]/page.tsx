'use client';

import { useParams } from 'next/navigation';
import RetroPage from '../../../components/Retro/RetroPage';

export default function RetroDetailPage() {
  const params = useParams();
  const boardId = params.id as string;

  return <RetroPage boardId={boardId} />;
}
