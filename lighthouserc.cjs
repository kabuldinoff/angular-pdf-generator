module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npx serve -s dist/angular-pdf-generator/browser -l 8080',
      startServerReadyPattern: 'Accepting connections at',
      url: ['http://localhost:8080/'],
      numberOfRuns: 1,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
