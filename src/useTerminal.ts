import { createEffect, onCleanup, useContext } from 'solid-js';
import { TerminalContext } from './TerminalProvider';
import { Terminal } from 'xterm';

type TerminalCleanupCallback = () => void;
type TerminalMountCallback = (terminal: Terminal) => TerminalCleanupCallback;
type TerminalDismountCallback = (terminal: Terminal) => void;

const useTerminal = () => {
  const { terminal, setTerminal } = useContext(TerminalContext);

  const onTerminalMount = (callback: TerminalMountCallback) => {
    createEffect(() => {
      const currentTerminal = terminal();
      if (!currentTerminal) return;
      const cleanup = callback(currentTerminal);
      onCleanup(cleanup);
    });
  };

  const onTerminalDismount = (callback: TerminalDismountCallback) => {
    createEffect<Terminal | undefined>((previousTerminal) => {
      if (previousTerminal && !terminal()) {
        callback(previousTerminal);
      }
      return terminal();
    });
  };

  return { terminal, setTerminal, onTerminalMount, onTerminalDismount };
};

export default useTerminal;
