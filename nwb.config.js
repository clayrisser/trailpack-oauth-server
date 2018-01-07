module.exports = {
  type: 'web-module',
  npm: {
    esModules: true,
    umd: false
  },
  babel: {
    config: (config) => {
      config.presets = [
        'node6',
        'stage-2'
      ];
      return config;
    }
  }
}
