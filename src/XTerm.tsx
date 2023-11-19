import { createEffect, onCleanup, useContext } from 'solid-js';
import {
  ITerminalAddon,
  ITerminalInitOnlyOptions,
  ITerminalOptions,
  Terminal,
} from 'xterm';
import '../node_modules/xterm/css/xterm.css';
import { TerminalContext } from './TerminalProvider';

export interface XTermProps {
  /**
   * The CSS classes that will be applied to the terminal container.
   */
  class?: string;

  /**
   * A set of options for the terminal that will be provided on loading.
   * A list of all available properties can be found at https://xtermjs.org/docs/api/terminal/interfaces/iterminaloptions/
   */
  options?: ITerminalOptions & ITerminalInitOnlyOptions;

  /**
   * An array of addons that will be loaded into XTerm. A list of officially supported addons can be found at https://github.com/xtermjs/xterm.js/tree/master/addons/
   * @example
   * ```tsx
   * import { SearchAddon } from 'xterm-addon-search';
   * import { FitAddon } from 'xterm-addon-fit';
   *
   * ...
   *
   * <XTerm addons={[SearchAddon, FitAddon]} />
   * ```
   */
  addons?: ITerminalAddon[];

  /**
   * A callback that will be called when the bell is triggered.
   */
  onBell?: () => void;

  /**
   * A callback that will be called when a binary event fires. This is used to enable non UTF-8 conformant binary messages to be sent to the backend. Currently this is only used for a certain type of mouse reports that happen to be not UTF-8 compatible. The event value is a JS string, pass it to the underlying pty as binary data, e.g. `pty.write(Buffer.from(data, 'binary'))`.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onbinary
   * @param data
   * @returns
   */
  onBinary?: (data: string) => void;

  /**
   * A callback that will be called when the cursor moves.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#oncursormove
   * @param cursorPosition An object containing x and y properties representing the new cursor position.
   * @returns
   */
  onCursorMove?: (cursorPosition: { x: number; y: number }) => void;

  /**
   * A callback that will be called when a data event fires. This happens for example when the user types or pastes into the terminal. The event value is whatever string results, in a typical setup, this should be passed on to the backing pty.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#ondata
   * @param data
   * @returns
   */
  onData?: (data: string) => void;

  /**
   * A callback that will be called when a key is pressed. The event value contains the string that will be sent in the data event as well as the DOM event that triggered it.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onkey
   * @param event An object containing a key property representing the string sent to the data event, and a domEvent property containing the DOM event that triggered the keypress.
   * @returns
   */
  onKey?: (event: { key: string; domEvent: KeyboardEvent }) => void;

  /**
   * A callback that will be called when a line feed is added.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onlinefeed
   * @returns
   */
  onLineFeed?: () => void;

  /**
   * A callback that will be called when rows are rendered. The event value contains the start row and end rows of the rendered area (ranges from 0 to Terminal.rows - 1).
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onrender
   * @param event An object containing start and end properties which represent the start and end rows (inclusive) of the rendered area.
   * @returns
   */
  onRender?: (event: { start: number; end: number }) => void;

  /**
   * A callback that will be called when the terminal is resized.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onresize
   * @param size An object containing cols and rows properties representing the new size.
   * @returns
   */
  onResize?: (size: { cols: number; rows: number }) => void;

  /**
   * A callback that will be called when a scroll occurs.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onscroll
   * @param yPos The new y-position of the viewport.
   * @returns
   */
  onScroll?: (yPos: number) => void;

  /**
   * A callback that will be called when a selection change occurs.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onselectionchange
   * @returns
   */
  onSelectionChange?: () => void;

  /**
   * A callback that will be called when an OSC 0 or OSC 2 title change occurs.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#ontitlechange
   * @param title The new title.
   * @returns
   */
  onTitleChange?: (title: string) => void;

  /**
   * A callback that will be called when data has been parsed by the terminal, after write is called. This event is useful to listen for any changes in the buffer.
   * This fires at most once per frame, after data parsing completes. Note that this can fire when there are still writes pending if there is a lot of data.
   * @see https://xtermjs.org/docs/api/terminal/classes/terminal/#onwriteparsed
   * @returns
   */
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

  const { setTerminal } = useContext(TerminalContext);

  createEffect(() => {
    if (!terminalContainerRef) return;

    terminal = new Terminal(options);
    terminal.open(terminalContainerRef);

    addons.forEach((addon) => {
      terminal?.loadAddon(addon);
    });

    setTerminal && setTerminal(terminal);

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
