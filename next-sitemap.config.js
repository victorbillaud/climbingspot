// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.climbingspot.eu',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/server-sitemap.xml'],
  alternateRefs: [
    {
      href: 'https://www.climbingspot.eu/fr',
      hreflang: 'fr',
    },
    {
      href: 'https://www.climbingspot.eu/en',
      hreflang: 'en',
    },
  ],
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/spot'),
    await config.transform(config, '/event'),
    await config.transform(config, '/maps'),
    await config.transform(config, '/'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/*', '/settings/*', '/auth/*'],
      },
    ],
    additionalSitemaps: [
      'https://climbingspot.eu/server-sitemap.xml', // <==== Add here
    ],
  },
};
