/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      webVitalsAttribution: ['CLS', 'LCP'],
    },
    headers: async () => {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'Permissions-Policy',
              value: 'web-share=*',
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;