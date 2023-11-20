import MyTerminal from './MyTerminal';
import TerminalProvider from './TerminalProvider';
import useTerminal from './useTerminal';

const App = () => {
  return (
    <TerminalProvider>
      <MyTerminal />
    </TerminalProvider>
  );
};

export default App;
