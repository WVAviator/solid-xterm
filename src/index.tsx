/* @refresh reload */
import { render } from 'solid-js/web';

import App from './App';
import TerminalProvider from './TerminalProvider';

render(() => <App />, document.getElementById('root') as HTMLElement);
