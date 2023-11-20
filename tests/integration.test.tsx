/** @jsxImportSource solid-js */

import { render } from '@solidjs/testing-library';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import TerminalProvider from '../src/TerminalProvider';
import XTerm from '../src/XTerm';
import useTerminal from '../src/useTerminal';

describe('integration tests', () => {
  beforeAll(() => {});
  it('should allow testing of components', async () => {
    const App = () => {
      return <div>Hello, World!</div>;
    };
    const { getByText } = render(() => <App />);

    expect(getByText('Hello, World!')).toBeTruthy();
  });

  it('should render and write to the terminal', async () => {
    const App = () => {
      const { onTerminalMount } = useTerminal();

      onTerminalMount((terminal) => {
        terminal.write('Hello, World!');
        return () => {};
      });

      return (
        <div>
          <XTerm />
        </div>
      );
    };

    const { findByText } = render(() => (
      <TerminalProvider>
        <App />
      </TerminalProvider>
    ));

    expect(await findByText('Hello, World!')).toBeTruthy();
  });
});
