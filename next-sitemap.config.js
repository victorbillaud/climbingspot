// next-sitemap.config.js

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://climbingspot.eu',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
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
