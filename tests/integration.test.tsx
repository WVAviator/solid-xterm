/** @jsxImportSource solid-js */

import { render } from '@solidjs/testing-library';
import { beforeAll, describe, expect, it } from 'vitest';
import XTerm from '../src/XTerm';

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
});
