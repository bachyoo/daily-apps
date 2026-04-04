'use client';

import { useState } from 'react';
import { AppCard } from './AppCard';
import { CategoryFilter } from './CategoryFilter';

interface AppData {
  id: string; name: string; description: string; category: string;
  day: number; date: string; thumbnail: string; path: string;
}

export function AppGallery({ apps }: { apps: AppData[] }) {
  const [category, setCategory] = useState('all');
  const filtered = category === 'all' ? apps : apps.filter((a) => a.category === category);

  return (
    <div>
      <CategoryFilter selected={category} onSelect={setCategory} />
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-4">🚀</p>
          <p>아직 앱이 없습니다. 첫 번째 앱을 만들어보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {filtered.map((app) => <AppCard key={app.id} {...app} />)}
        </div>
      )}
    </div>
  );
}
