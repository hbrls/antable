const path = require('path');
const buble = require('rollup-plugin-buble');
const version = process.env.VERSION || require('../package.json').version;

const banner = '/*! @lattebank/antable v' + version + ' (c) 2017 */';

const builds = {
  'ANTable': {
    input: path.resolve(__dirname, '../src/ANTable.jsx'),
    output: path.resolve(__dirname, '../dist/ANTable.common.js'),
    external: [
      'react',
      'antd/lib/button',
      'antd/lib/col',
      'antd/lib/form',
      'antd/lib/input',
      'antd/lib/row',
      'antd/lib/select',
      'antd/lib/table',
    ],
    format: 'cjs',
    banner,
  },
};

function genConfig(opts) {
  const config = {
    input: opts.input,
    output: opts.output,
    external: opts.external,
    format: opts.format,
    banner: opts.banner,
    name: 'ANTable',
    plugins: [
      buble(),
    ]
  };

  return config;
}

exports.getBuild = name => genConfig(builds[name]);
exports.getAllBuilds = () => Object.keys(builds).map(name => genConfig(builds[name]));
