// Windows EMFILE：限制并发打开文件（含 fs.promises；worker 仍可能触顶）
try {
  require('graceful-fs').gracefulify(require('fs'));
} catch {
  // optional
}

const fsp = require('fs/promises');
const originalOpen = fsp.open.bind(fsp);
const originalReadFile = fsp.readFile.bind(fsp);
let activeOpens = 0;
const openWaiters = [];
const MAX_CONCURRENT_OPENS = 24;

function withOpenLimit(fn) {
  return new Promise((resolve, reject) => {
    const run = () => {
      activeOpens += 1;
      Promise.resolve()
        .then(fn)
        .then(resolve, reject)
        .finally(() => {
          activeOpens -= 1;
          const next = openWaiters.shift();
          if (next) next();
        });
    };
    if (activeOpens >= MAX_CONCURRENT_OPENS) {
      openWaiters.push(run);
    } else {
      run();
    }
  });
}

fsp.open = (...args) => withOpenLimit(() => originalOpen(...args));
fsp.readFile = (...args) => withOpenLimit(() => originalReadFile(...args));

const { getDefaultConfig } = require('expo/metro-config');
const { withNativewind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Windows 上并发打开文件过多易触发 EMFILE，限制 worker
config.maxWorkers = 1;

// Polyfill buffer for react-native-svg
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve('buffer'),
};

module.exports = withNativewind(config, { inlineRem: 16 });
