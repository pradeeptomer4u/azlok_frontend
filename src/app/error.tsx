'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8ee] pt-0">
      <div className="max-w-md w-full text-center -mt-32">
        <Image
          src="/images/errors/spice-error.png"
          alt="Error Illustration"
          width={450}
          height={450}
          priority
          className="mx-auto -mb-3"
        />
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="flex items-center justify-center gap-4 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-full transition-colors duration-300 shadow-md text-sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-4 bg-white border border-green-600 text-green-600 hover:bg-green-50 py-2 px-4 rounded-full transition-colors duration-300 shadow-md text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
