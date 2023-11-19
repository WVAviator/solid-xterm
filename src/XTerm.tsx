import { createEffect, onCleanup } from 'solid-js';
import {
  ITerminalAddon,
  ITerminalInitOnlyOptions,
  ITerminalOptions,
  Terminal,
} from 'xterm';
import '../node_modules/xterm/css/xterm.css';
import useTerminal from './useTerminal';

interface XTermProps {
  class?: string;
  options?: ITerminalOptions & ITerminalInitOnlyOptions;
  addons?: ITerminalAddon[];
  onBell?: () => void;
  onBinary?: (data: string) => void;
  onCursorMove?: (cursorPosition: { x: number; y: number }) => void;
  onData?: (data: string) => void;
  onKey?: (event: { key: string; domEvent: KeyboardEvent }) => void;
  onLineFeed?: () => void;
  onRender?: (event: { start: number; end: number }) => void;
  onResize?: (size: { cols: number; rows: number }) => void;
  onScroll?: (yPos: number) => void;
  onSelectionChange?: () => void;
  onTitleChange?: (title: string) => void;
  onWriteParsed?: () => void;
}

const XTerm = ({
  class: className = '',
  options = {},
  addons = [],
  onBell = () => {},
  onBinary = () => {},
  onCursorMove = () => {},
  onData = () => {},
  onKey = () => {},
  onLineFeed = () => {},
  onRender = () => {},
  onResize = () => {},
  onScroll = () => {},
  onSelectionChange = () => {},
  onTitleChange = () => {},
  onWriteParsed = () => {},
}: XTermProps) => {
  let terminalContainerRef: HTMLDivElement | undefined;
  let terminal: Terminal | undefined;

  const { setTerminal } = useTerminal();

  createEffect(() => {
    if (!terminalContainerRef) return;

    terminal = new Terminal(options);
    terminal.open(terminalContainerRef);

    addons.forEach((addon) => {
      terminal?.loadAddon(addon);
    });

    setTerminal(terminal);

    onCleanup(() => {
      setTerminal(undefined);
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

  createEffect(() => {
    if (!terminal) return;
    const onKeyListener = terminal.onKey((event) => onKey(event));
    onCleanup(() => {
      onKeyListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onLineFeedListener = terminal.onLineFeed(() => onLineFeed());
    onCleanup(() => {
      onLineFeedListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onRenderListener = terminal.onRender((event) => onRender(event));
    onCleanup(() => {
      onRenderListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onResizeListener = terminal.onResize((size) => onResize(size));
    onCleanup(() => {
      onResizeListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onScrollListener = terminal.onScroll((yPos) => onScroll(yPos));
    onCleanup(() => {
      onScrollListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onSelectionChangeListener = terminal.onSelectionChange(() =>
      onSelectionChange()
    );
    onCleanup(() => {
      onSelectionChangeListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onTitleChangeListener = terminal.onTitleChange((title) =>
      onTitleChange(title)
    );
    onCleanup(() => {
      onTitleChangeListener.dispose();
    });
  });

  createEffect(() => {
    if (!terminal) return;
    const onWriteParsedListener = terminal.onWriteParsed(() => onWriteParsed());
    onCleanup(() => {
      onWriteParsedListener.dispose();
    });
  });

  return <div class={className} ref={terminalContainerRef}></div>;
};

export default XTerm;
