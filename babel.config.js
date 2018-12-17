module.exports = {
  presets: [
    '@babel/preset-typescript',
    ['jason', { debug: true, targets: { electron: '2' } }],
  ],
}
