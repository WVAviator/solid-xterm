# solid-xterm

A simple reactive SolidJS component wrapper for [xterm.js](https://xtermjs.org/).

## Installation

```bash
npm i solid-xterm
```

## Usage

To get started, you can render a terminal using the XTerm component. This will create the terminal with default styling and automatically attach the terminal to the DOM.

```tsx
import { XTerm } from 'solid-xterm';

const MyTerminal = () => {
  return <XTerm />;
};
```

On its own, the XTerm component will not directly process user input (and will do pretty much nothing if you display it like this). Instead, you are expected to pass input to a backing pseudo-terminal (pty) using the `onData` callback. This callback will be called with the user input as a string. Note that even non printable characters such as arrow keys will be passed to this callback as ANSI escape sequences - your pty should know what to do with these and should provide a response that XTerm can understand.

```tsx
const MyTerminal = () => {
  return (
    <XTerm
      onData={(data) => {
        // Your logic to pass data to backing pty
      }}
    />
  );
};
```

Once your pty provides output, you can display it in the terminal by passing it to the `terminal.write()` method. This method will be available on the terminal instance provided in the onData callback.

```tsx
const MyTerminal = () => {
  return (
    <XTerm
      onData={async (data, terminal) => {
        const response = await sendToPty(data);
        terminal().write(response);
      }}
    />
  );
};
```

To gain access to the terminal instance, you can use the `onMount` prop. This will be invoked when the terminal is first mounted to the DOM. Optionally your callback can return a cleanup function that will be invoked when the terminal unmounts. Use this function to subscribe to events related to your backing pty and invoke functions on the terminal in response.

```tsx
import { XTerm, Terminal } from 'xterm';

const MyTerminal = () => {
  const handleMount = (terminal: Terminal) => {
    terminal().write('Hello World!');
    return () => {
      console.log('Terminal unmounted.');
    };
  };

  return <XTerm onMount={handleMount} />;
};
```

The examples above demonstrate the use of onData and onMount, but there are many other [event properties on the xterm.js Terminal object](https://xtermjs.org/docs/api/terminal/classes/terminal/) that are implemented in this wrapper. Below is a list of all the events to which you can add listener callbacks, and the provided arguments to those callbacks. Note that, to maintain reactivity patterns in SolidJS, every callback is provided a reference to the current terminal in addition to the default arguments provided by the xterm.js library.

Please reference the [xterm.js docs](https://xtermjs.org/docs/) for additional information on these events.

| Prop              | Description                                                              | Callback Args                                                       |
| ----------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| onMount           | Invoked when the terminal is added to the DOM                            | terminal: Terminal                                                  |
| onBell            | Invoked when the bell is triggered                                       | terminal: Terminal                                                  |
| onBinary          | Invoked when a binary event fires                                        | data: string, terminal: Terminal                                    |
| onCursorMove      | Invoked when the cursor moves                                            | cursorPosition: { x: number, y: number }, terminal: Terminal        |
| onData            | Invoked when a data event fires                                          | data: string, terminal: Terminal                                    |
| onKey             | Invoked when a key is pressed                                            | event: { key: string, domEvent: KeyboardEvent }, terminal: Terminal |
| onLineFeed        | Invoked when a line feed is added                                        | terminal: Terminal                                                  |
| onRender          | Invoked when rows are rendered                                           | event: { start: number, end: number }, terminal: Terminal           |
| onResize          | Invoked when the terminal is resized                                     | size: { cols: number, rows: number }, terminal: Terminal            |
| onScroll          | Invoked when a scroll occurs                                             | yPos: number, terminal: Terminal                                    |
| onSelectionChange | Invoked when a selection change occurs                                   | terminal: Terminal                                                  |
| onTitleChange     | Invoked when an OSC 0 or OSC 2 title change occurs                       | title: string, terminal: Terminal                                   |
| onWriteParsed     | Invoked when data has been parsed by the terminal, after write is called | terminal: Terminal                                                  |

## Contributing

I'm new to SolidJS. You may have some better ideas regarding this component. If you're interested in contributing, please open an issue first to discuss what you would like to change.
