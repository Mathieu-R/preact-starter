import { h, render } from 'preact'
import App from './components/app'

// render a root component in <body>
const rendering = Component => {
  const root = render(<Component/>, document.body, root);
};

// preact hmr
if (module.hot) {
  console.log('HMR');
  require('preact/devtools'); // use react devtools only in dev
  module.hot.accept('./components/app', rendering(App));
}



//rendering(App);