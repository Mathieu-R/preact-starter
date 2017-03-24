import { h, render } from 'preact'
import App from './components/app'

// render a root component in <body>
const rendering = Component => {
  const root = render(<Component/>, document.body, root);
};

rendering(App);

// preact hmr
if (module.hot) {
  require('preact/devtools'); // use react devtools only in dev
  module.hot.accept('./components/app', _ => {
    const nextRootContainer = require('./components/app');
    requestAnimationFrame(rendering(nextRootContainer));
  })
}
