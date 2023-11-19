import {
  Accessor,
  ResolvedChildren,
  Setter,
  createContext,
  createSignal,
} from 'solid-js';
import { Terminal } from 'xterm';

interface TerminalState {
  terminal: Accessor<Terminal | undefined>;
  setTerminal: Setter<Terminal | undefined>;
}

export const TerminalContext = createContext<TerminalState>({
  terminal: () => undefined,
  setTerminal: () => undefined,
});

interface TerminalProviderProps {
  children: ResolvedChildren;
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
const TerminalProvider = ({ children }: TerminalProviderProps) => {
  const [terminal, setTerminal] = createSignal<Terminal | undefined>();

  return (
    <TerminalContext.Provider value={{ terminal, setTerminal }}>
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
