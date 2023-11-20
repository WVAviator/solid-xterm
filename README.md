# solid-xterm

A simple reactive SolidJS component wrapper for xterm.js.

## Installation

```bash
npm i solid-xterm
```

## Usage

To get started, you can render a terminal using the XTerm component. This will create the terminal with default styling and automatically attach the terminal to the DOM.

```tsx
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

To gain access to the terminal instance, you can use the `onMount` prop. This will be invoked when the terminal is first mounted to the DOM. Also note that any of the other event handlers provide to XTerm will also be provided with the current terminal instance as the last argument.

```tsx
const MyTerminal = () => {
  const handleMount = (terminal: Terminal) => {
    terminal().write('Hello World!');
  };

  return <XTerm onMount={handleMount} />;
};
```
