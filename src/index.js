import { render } from 'preact';
import App from './components/app';

if (process.env.NODE_ENV === 'development') {
  // react devtools
  require('preact/debug');
}

let root = document.body.firstElementChild;
// render a root component in <body>
const rendering = Component => {
  root = render(<Component/>, document.body, root);
};

// preact hmr
if (module.hot) {
  module.hot.accept('./components/app', () => rendering(App));
}

rendering(App);
