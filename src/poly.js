const defaultFeatures = [
  'Map',
  'Set',
  'requestAnimationFrame',
];

function browserSupportsAllFeatures(features) {
  return features.every(f => window[f]);
}

function missingFeatures(features) {
  return features.filter(f => !window[f]);
}

function loadScript(features, done) {
  // eslint-disable-next-line prefer-template
  const cdn = 'https://cdn.polyfill.io/v2/polyfill.min.js?features=' + missingFeatures(features).join();
  const js = document.createElement('script');
  js.src = cdn;
  js.onload = function onLoad() {
    done();
  };
  js.onerror = function onError() {
    // eslint-disable-next-line prefer-template
    done(new Error('Failed to load script ' + cdn));
  };
  document.head.appendChild(js);
}

module.exports = (featureList = defaultFeatures, done) => {
  function registerServiceWorker(err) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          // eslint-disable-next-line no-console
          console.log('SW registered: ', registration);
          done(err);
        }).catch((registrationError) => {
          // eslint-disable-next-line no-console
          console.error('SW registration failed: ', registrationError);
          done(err);
        });
      });
    } else {
      done(err);
    }
  }

  if (browserSupportsAllFeatures(featureList)) {
    registerServiceWorker();
  } else {
    loadScript(featureList, registerServiceWorker);
  }
};
