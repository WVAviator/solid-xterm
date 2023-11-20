import { useContext } from 'solid-js';
import { TerminalContext } from './TerminalProvider';

/**
 * A wrapper for accessing the terminal context withing a TerminalProvider component.
 * @returns An array containing the signal for the current terminal and a callback to set the current terminal.
 */
const useTerminalContext = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error(
      'The XTerm component must be used within a TerminalProvider. Please wrap any components that wish to access the terminal context in a TerminalProvider component.'
    );
  }
  return context;
};

export default useTerminalContext;
