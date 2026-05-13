/** @type {import('@lhci/utils').LHCI.ServerCommandOptions & import('@lhci/utils').LHCI.CollectCommandOptions} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2,
      settings: {
        preset: 'desktop',
        onlyCategories: ['accessibility'],
        skipAudits: ['uses-http2']
      },
      url: [
        'http://127.0.0.1:4173/login',
        'http://127.0.0.1:4173/',
        'http://127.0.0.1:4173/ma/secure-share'
      ],
      startServerCommand: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: '127.0.0.1:4173'
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }]
      }
    }
  }
};
