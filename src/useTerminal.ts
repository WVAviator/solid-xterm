import { Accessor, createEffect, onCleanup } from 'solid-js';
import { Terminal } from 'xterm';
import useTerminalContext from './useTerminalContext';

type TerminalCleanupCallback = () => void;
type TerminalMountCallback = (terminal: Terminal) => TerminalCleanupCallback;
type TerminalDismountCallback = (terminal: Terminal) => void;

interface UseTerminal {
  /**
   * A signal accessor that returns the current terminal.
   * @returns The current terminal.
   */
  terminal: Accessor<Terminal | undefined>;

  /**
   * Takes a callback that is called when the terminal mounts. The callback is passed the current terminal. The return value of the callback should be another callback that is called for cleanup when the terminal dismounts.
   * @param callback
   * @example
   *
   * ```tsx
   * const { onTerminalMount } = useTerminal();
   *
   * onTerminalMount((terminal) => {
   *    // Do something with the newly-mounted terminal
   *    return () => {
   *      // Do some cleanup when the terminal dismounts
   *    };
   * });
   * ```
   *
   */
  onTerminalMount: (callback: TerminalMountCallback) => void;

  /**
   * Takes a callback that is called when the terminal dismounts. The callback is passed the previous terminal.
   * @param callback
   * @returns
   */
  onTerminalDismount: (callback: TerminalDismountCallback) => void;
}

/**
 * A hook that enables access to the terminal in the current context.
 * @returns An object containing the current terminal and two callbacks for when the terminal mounts and dismounts.
 */
const useTerminal = (): UseTerminal => {
  const [terminal] = useTerminalContext();

  const onTerminalMount = (callback: TerminalMountCallback) => {
    createEffect<Terminal | undefined>(() => {
      const currentTerminal = terminal();
      if (!currentTerminal) return;

      const cleanup = callback(currentTerminal);
      onCleanup(cleanup);
      return currentTerminal;
    });
  };

  const onTerminalDismount = (callback: TerminalDismountCallback) => {
    createEffect<Terminal | undefined>((previousTerminal) => {
      if (previousTerminal && !terminal()) {
        callback(previousTerminal);
      }
      return terminal();
    }, terminal());
  };

  return { terminal, onTerminalMount, onTerminalDismount };
};

export default useTerminal;
