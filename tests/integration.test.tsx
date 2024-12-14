/** @jsxImportSource solid-js */

import { render } from '@solidjs/testing-library';
import { beforeAll, describe, expect, it } from 'vitest';
import XTerm from '../src/XTerm';
import { FitAddon } from '@xterm/addon-fit';
import { SearchAddon } from '@xterm/addon-search';
import { createMemo } from 'solid-js';

describe('integration tests', () => {
  beforeAll(() => {});
  it('should allow testing of components', async () => {
    const App = () => {
      return <div>Hello, World!</div>;
    };
    const { getByText, unmount } = render(() => <App />);

    expect(getByText('Hello, World!')).toBeTruthy();
    unmount();
  });

  it('should render and write to the terminal', async () => {
    const App = () => {
      const handleTerminalMount = (terminal) => {
        terminal.write('Hello, World!');
        return () => {};
      };

      return (
        <>
          <XTerm onMount={handleTerminalMount} />
        </>
      );
    };

    const { findByText, unmount } = render(() => <App />);

    expect(await findByText('Hello, World!')).toBeTruthy();
    unmount();
  });

  it('should allow addon constructors or instances', async () => {
    const searchAddon = createMemo(() => new SearchAddon());
    const App = () => {
      return <XTerm addons={[FitAddon, searchAddon()]} />;
    };
    const { unmount } = render(() => <App />);
    unmount();
  });
});
