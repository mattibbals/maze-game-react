import React, { useState, useEffect, useRef } from 'react';
//import SpinningCube from './components/spinningCube'
import Maze from './components/maze'
import './App.css';
import { io } from 'socket.io-client';
import { ConnectionState } from './components/ConnectionState';
import { ConnectionManager } from './components/ConnectionManager';
import { Events } from "./components/Events";
import { MyForm } from './components/MyForm';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [fooEvents, setFooEvents] = useState([]);
  const [mapFromServer, setMapFromServer] = useState(false);
  const [collectablesFromServer, setCollectablesFromServer] = useState([])
  const [playersFromServer, setPlayersFromServer] = useState([])
  const socket = useRef(false);

  useEffect(() => {
    if (socket.current.connected) {
      function onFooEvent(value) {
        setFooEvents(fooEvents.concat(value));
      }
    
      socket.current.on('foo', onFooEvent);
    
      return () => {
        socket.current.off('foo', onFooEvent);
      };
    }

  }, [fooEvents, socket]);

/*
  useEffect(() => {
    function onFooEvent(value) {
      setFooEvents(fooEvents.concat(value));
    }
  
    socket.on('foo', onFooEvent);
  
    return () => {
      socket.off('foo', onFooEvent);
    };
  }, [fooEvents]);

  useEffect(() => {
    // no-op if the socket is already connected
    socket.connect();
  
    return () => {
      socket.disconnect();
    };
  }, []); */

  useEffect(()=>{
    socket.current = io('//:5000', {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd"
      }
    });

      console.log('socket = ', socket.current);

      function onConnect() {
       console.log('connected socket : ', socket.current.id)
       setIsConnected(true);
     }
   
     function onDisconnect() {
       console.log('disconnected socket : ', socket.current.id)
       setIsConnected(false);
     }
   
     socket.current.on('connect', onConnect);
     socket.current.on('disconnect', onDisconnect);
     socket.current.on('mapFromServer', ({ map, collectables, players }) => {
      setMapFromServer(map);
      setCollectablesFromServer(collectables);
      console.log('player received : ', players);
      setPlayersFromServer(players);
     });
   
     socket.current.on("connect_error", (err) => {
       // the reason of the error, for example "xhr poll error"
       console.log('socket connect error : ', err);
       setTimeout(()=>socket.current.connect(),5000)
     });
   
     return () => {
       socket.current.off('connection', onConnect);
       socket.current.off('disconnect', onDisconnect);
       socket.current.off('connect_error');
       socket.current.off('mapFromServer');
     };



 
 },[])
 console.log('socket.current.id = ', socket.current.id);
 console.log('playersFromServer = ', playersFromServer);
  return (
    <div className="App">
      <ConnectionState socket={ socket } isConnected={ isConnected } />
      <Events events={ fooEvents } />
      <ConnectionManager socket={ socket } />
      <MyForm socket={ socket } />
      {mapFromServer && playersFromServer.some(player => player.socketId === socket.current.id) && <Maze
        collectablesFromServer={ collectablesFromServer }
        mapFromServer={ mapFromServer }
        playerFromServer={ playersFromServer.find(player => player.socketId === socket.current.id) }
        otherPlayersFromServer={ playersFromServer.filter(player => player.socketId !== socket.current.id) }
      />}
    </div>
  );
}

export default App;
