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

const TerminalProvider = ({ children }: TerminalProviderProps) => {
  const [terminal, setTerminal] = createSignal<Terminal | undefined>();

  return (
    <TerminalContext.Provider value={{ terminal, setTerminal }}>
      {children}
    </TerminalContext.Provider>
  );
};

export default TerminalProvider;
