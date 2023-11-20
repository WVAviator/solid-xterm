import XTerm from './XTerm';
import useTerminal from './useTerminal';

const MyTerminal = () => {
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

export default MyTerminal;
