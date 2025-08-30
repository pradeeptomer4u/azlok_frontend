'use client';

import { useEffect } from 'react';
import { startKeepAlive } from '../../utils/keepAlive';

export default function KeepAliveInitializer() {
  useEffect(() => {
    // Initialize the keep-alive service
    startKeepAlive();
  }, []);

  // This component doesn't render anything
  return null;
}
