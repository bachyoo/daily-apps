'use client';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'utility', label: '유틸리티' },
  { id: 'game', label: '게임' },
  { id: 'lifestyle', label: '라이프스타일' },
  { id: 'productivity', label: '생산성' },
];

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
            selected === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
