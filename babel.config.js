const common = {
  presets: [
    [
      '@babel/env',
      {
        loose: true,
        useBuiltIns: 'entry',
        corejs: 3,
        modules: false,
        shippedProposals: true,
        targets: {
          node: '10',
          browsers: [
            'last 2 Chrome versions',
            'last 2 Firefox versions',
            'last 2 Safari versions',
            'last 1 Edge versions',
          ],
        },
      },
    ],
    '@babel/preset-react',
    '@babel/typescript',
  ],
  overrides: [
    {
      test(filename) {
        return (
          filename && (filename.endsWith('.tsx') || filename.endsWith('.ts'))
        )
      },
      presets: [
        [
          '@babel/preset-typescript',
          {
            isTSX: true,
            allExtensions: true,
          },
        ],
      ],
    },
  ],
  sourceMaps: true,
}

module.exports = (api) => {
  if (api && api.cache && api.cache.never) api.cache.never()
  return common
}
