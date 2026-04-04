'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

export function AdBanner() {
  const adClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    if (adLoaded && adClientId) {
      try {
        // @ts-expect-error adsbygoogle is injected by AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded yet
      }
    }
  }, [adLoaded, adClientId]);

  if (!adClientId) {
    return (
      <div className="w-full h-[90px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
        광고 영역
      </div>
    );
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClientId}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
        onLoad={() => setAdLoaded(true)}
      />
      <div className="w-full flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '90px' }}
          data-ad-client={adClientId}
          data-ad-slot="auto"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    </>
  );
}
