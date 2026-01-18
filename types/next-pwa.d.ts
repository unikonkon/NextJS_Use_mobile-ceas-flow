declare module 'next-pwa' {
  import type { NextConfig } from 'next';

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    disable?: boolean;
    buildExcludes?: (string | RegExp)[];
    fallbacks?: {
      document?: string;
      image?: string;
      audio?: string;
      video?: string;
      font?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    scope?: string;
    sw?: string;
    publicExcludes?: string[];
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
  }

  function withPWAInit(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWAInit;
}
