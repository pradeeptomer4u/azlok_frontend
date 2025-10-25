'use client';

import React from 'react';
import Image from 'next/image';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex items-center justify-center bg-[#fff8ee] pt-0">
          <div className="max-w-md w-full text-center -mt-32">
            <Image
              src="/images/errors/spice-error.png"
              alt="Error Illustration"
              width={350}
              height={280}
              priority
              className="mx-auto -mb-3"
            />
            <div className="flex justify-center">
              <button
                onClick={reset}
                className="flex items-center justify-center gap-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition-colors duration-300 shadow-md text-sm"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh to taste again!
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
