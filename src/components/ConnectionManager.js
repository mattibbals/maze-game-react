import React from 'react';

export function ConnectionManager({ socket }) {
  function connect() {
    socket.current.connect();
  }

  function disconnect() {
    socket.current.disconnect();
  }

  return (
    <>
      <button onClick={ connect }>Connect</button>
      <button onClick={ disconnect }>Disconnect</button>
    </>
  );
}