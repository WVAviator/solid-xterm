import { Accessor, JSX, Setter, createContext, createSignal } from 'solid-js';
import { Terminal } from 'xterm';

type TerminalState =
  | [
      Accessor<Terminal | undefined>,
      Setter<Terminal | undefined>
      // setTerminal: (terminal: Terminal | undefined) => void;
    ]
  | undefined;

export const TerminalContext = createContext<TerminalState>();

interface TerminalProviderProps {
  children: JSX.Element;
}

/**
 * The TerminalProvider component should wrap portions of your application that need to access methods on the terminal.
 * Components within the TerminalProvider can access the terminal instance using the useTerminal hook.
 * @example
 * ```tsx
 * import { TerminalProvider } from 'solid-xterm';
 * import { useTerminal } from 'solid-xterm';
 *
 * const App = () => (
 *  <TerminalProvider>
 *      <MyComponent />
 *  <TemrinalProvider />
 * );
 *
 * const MyComponent = () => {
 *   const { terminal } = useTerminal();
 *   // Do something with the terminal instance
 *   // For example, terminal.write('Hello, World!');
 *   return (
 *     <div>
 *       <XTerm />
 *     </div>
 *   );
 * };
 * ```
 */
const TerminalProvider = (props: TerminalProviderProps) => {
  const [terminal, setTerminal] = createSignal<Terminal | undefined>(undefined);

  return (
    <TerminalContext.Provider value={[terminal, setTerminal]}>
      {props.children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
