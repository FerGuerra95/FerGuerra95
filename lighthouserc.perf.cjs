/** @type {import('@lhci/utils').LHCI.ServerCommandOptions & import('@lhci/utils').LHCI.CollectCommandOptions} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
        onlyCategories: ['performance', 'best-practices'],
        skipAudits: ['uses-http2', 'redirects-http']
      },
      url: ['http://127.0.0.1:4173/', 'http://127.0.0.1:4173/login'],
      startServerCommand:
        'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: '127.0.0.1:4173'
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.45 }],
        'categories:best-practices': ['error', { minScore: 0.88 }]
      }
    }
  }
};
