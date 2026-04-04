import { ReactNode } from 'react';
import { AdBanner } from './AdBanner';
import { Footer } from './Footer';

interface AppLayoutProps {
  appName: string;
  children: ReactNode;
}

export function AppLayout({ appName, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="w-full py-3 px-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <h1 className="text-lg font-semibold text-gray-900">{appName}</h1>
      </header>
      <main className="flex-1 w-full max-w-lg mx-auto px-4 py-6">
        {children}
      </main>
      <div className="w-full border-t border-gray-200">
        <AdBanner />
      </div>
      <Footer appName={appName} />
    </div>
  );
}
