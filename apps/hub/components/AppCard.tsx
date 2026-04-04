import Image from 'next/image';
import Link from 'next/link';

interface AppCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  day: number;
  thumbnail: string;
  path: string;
}

export function AppCard({ name, description, category, day, thumbnail, path }: AppCardProps) {
  return (
    <Link href={path} className="block rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative w-full h-40 bg-gray-100">
        <Image src={thumbnail || '/thumbnails/placeholder.png'} alt={name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">Day {day}</span>
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
        <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{category}</span>
      </div>
    </Link>
  );
}
