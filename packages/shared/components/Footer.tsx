import Link from 'next/link';

interface FooterProps {
  appName?: string;
}

export function Footer({ appName = 'Daily Apps' }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="w-full py-4 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
      <div className="flex justify-center gap-4 mb-2">
        <Link href="/privacy" className="hover:text-gray-700 underline">개인정보처리방침</Link>
        <Link href="/terms" className="hover:text-gray-700 underline">이용약관</Link>
      </div>
      <p>&copy; {year} {appName}</p>
    </footer>
  );
}
