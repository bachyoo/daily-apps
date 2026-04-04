import { AppGallery } from '@/components/AppGallery';
import { Footer } from '@daily-apps/shared';
import appsData from '@/data/apps.json';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full py-6 px-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Daily Apps</h1>
        <p className="text-gray-500 mt-1">매일 하나씩 만드는 무료 웹앱</p>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <AppGallery apps={appsData} />
      </main>
      <Footer appName="Daily Apps" />
    </div>
  );
}
