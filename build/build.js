const fs = require('fs');
const path = require('path');
const rollup = require('rollup');

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

let builds = require('./config').getAllBuilds()
// console.log(builds);

build(builds);

function build(builds) {
  let built = 0;
  const total = builds.length;
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built += 1;
      if (built < total) {
        next();
      }
    }).catch(logError);
  };

  next();
}

function buildEntry(config) {
  const isProd = /min\.js$/.test(config.dest);
  return rollup.rollup(config)
    .then(bundle => bundle.generate(config))
    .then(({ code, map }) => {
      if (isProd) {
        console.log('==== NO PROD ====');
      } else {
        return write(config.output, code);
      }
    });
}

function write(dest, code) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''));
      resolve();
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err);
      report();
    });
  })
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
