import {
  Accessor,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { Terminal } from 'xterm';
import '../node_modules/xterm/css/xterm.css';

interface XTermProps {
  onBell?: () => void;
  onBinary?: (data: string) => void;
  onCursorMove?: (cursorPosition: { x: number; y: number }) => void;
  onData?: (data: string) => void;
}

const XTerm = ({
  onBell = () => {},
  onBinary = () => {},
  onCursorMove = () => {},
  onData = () => {},
}: XTermProps) => {
  let terminalContainerRef: HTMLDivElement | undefined;
  let terminal: Terminal | undefined;

  createEffect(() => {
    if (!terminalContainerRef) {
      return;
    }
    terminal = new Terminal();
    terminal.open(terminalContainerRef);

    onCleanup(() => {
      terminal?.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onBellListener = terminal.onBell(() => onBell());
    onCleanup(() => {
      onBellListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onBinaryListener = terminal.onBinary((data) => onBinary(data));
    onCleanup(() => {
      onBinaryListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onCursorMoveListener = terminal.onCursorMove(() => {
      if (!terminal) return;
      const cursorX = terminal.buffer.active.cursorX;
      const cursorY = terminal.buffer.active.cursorY;
      const cursorPosition = { x: cursorX, y: cursorY };
      onCursorMove(cursorPosition);
    });
    onCleanup(() => {
      onCursorMoveListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onDataListener = terminal.onData((data) => onData(data));
    onCleanup(() => {
      onDataListener.dispose();
    });
  });

  return <div ref={terminalContainerRef}></div>;
};

export default XTerm;
