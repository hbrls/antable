const path = require('path');
const buble = require('rollup-plugin-buble');
const version = process.env.VERSION || require('../package.json').version;

const banner = '/*! @lattebank/atable v' + version + ' (c) 2017-present */';

const builds = {
  'atable': {
    input: path.resolve(__dirname, '../src/atable.js'),
    output: path.resolve(__dirname, '../dist/atable.js'),
    external: [
    ],
    format: 'cjs',
    banner,
  },
  'ATable': {
    input: path.resolve(__dirname, '../src/ATable.jsx'),
    output: path.resolve(__dirname, '../dist/ATable.common.js'),
    external: [
      'react',
      'antd/lib/button',
      'antd/lib/col',
      'antd/lib/form',
      'antd/lib/input',
      'antd/lib/popover',
      'antd/lib/row',
      'antd/lib/select',
      'antd/lib/table',
    ],
    format: 'cjs',
    banner,
  },
  'AForm': {
    input: path.resolve(__dirname, '../src/AForm.jsx'),
    output: path.resolve(__dirname, '../dist/AForm.common.js'),
    external: [
      'react',
      'antd/lib/button',
      'antd/lib/col',
      'antd/lib/form',
      'antd/lib/input',
      'antd/lib/modal',
      'antd/lib/row',
      'antd/lib/select',
      'antd/lib/spin',
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
    name: 'ATable',
    plugins: [
      buble(),
    ]
  };

  return config;
}

exports.getBuild = name => genConfig(builds[name]);
exports.getAllBuilds = () => Object.keys(builds).map(name => genConfig(builds[name]));
