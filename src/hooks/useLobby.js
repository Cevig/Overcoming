import {useCallback, useEffect, useRef, useState} from 'react';
import {LobbyAPI} from '../api';
import {logPlayerName, setPlayerNumber} from '../game/helpers/Utils';

const api = new LobbyAPI();

/**
 * Custom hook to manage lobby functionality
 * @param {string} lobbyId - The ID of the lobby
 * @param {number} pollInterval - Interval in ms to poll the server for updates
 * @returns {Object} - Lobby state and functions
 */
export const useLobby = (lobbyId, pollInterval = 2000) => {
  const [joined, setJoined] = useState([]);
  const [myID, setMyID] = useState(null);
  const [userAuthToken, setUserAuthToken] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [copied, setCopied] = useState(false);
  const [lobbyExists, setLobbyExists] = useState(true);
  const [nameSubmitted, setNameSubmitted] = useState(false);
  const intervalRef = useRef(null);
  const gameLinkBoxRef = useRef(null);
  const joinedRef = useRef([]);
  const lobbyExistsRef = useRef(true);

  const clearPollInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const arePlayersEqual = (prev, current) => {
    if (!prev || prev.length !== current.length) return false;
    return current.every((player, index) =>
      player.id === prev[index].id && player.name === prev[index].name
    );
  };

  const cleanup = useCallback(() => {
    if (lobbyId && myID !== null && userAuthToken) {
      api.leaveRoom(lobbyId, myID, userAuthToken);
    }
    clearPollInterval();
  }, [lobbyId, myID, userAuthToken, clearPollInterval]);

  const joinRoom = useCallback((playerNo, customName = "") => {
    if (!lobbyId) return;

    const username = customName || sessionStorage.getItem(`bgio-userName`+playerNo) || logPlayerName(playerNo + 1);
    // Store player name in metadata as JSON to be accessible on server side
    const metadata = JSON.stringify({
      id: (Math.random() + 1).toString(36).substring(7),
      playerName: username
    });

    api.joinRoom(lobbyId, username, playerNo, metadata)
      .then(authToken => {
        sessionStorage.setItem(`metadata-${playerNo}`, metadata);
        sessionStorage.setItem(`bgio-userName${playerNo}`, username);
        console.log("Joined room as player ", playerNo);
        setMyID(playerNo);
        setUserAuthToken(authToken);
        sessionStorage.setItem(`localAuth-${playerNo}`, authToken);
        setNameSubmitted(true);
      })
      .catch(error => {
        console.error("Error joining room:", error);
      });
  }, [lobbyId]);

  const checkRoomState = useCallback(() => {
    if (!lobbyId) return;

    api.whoIsInRoom(lobbyId)
      .then(players => {
        const joinedPlayers = players.filter((p) => p.name);
        const prevJoined = joinedRef.current;
        const prevLobbyExists = lobbyExistsRef.current;
        joinedRef.current = joinedPlayers;
        lobbyExistsRef.current = true;
        if (!prevLobbyExists || !arePlayersEqual(prevJoined, joinedPlayers)) {
          setJoined(joinedPlayers);
          setLobbyExists(true);
        }
      })
      .catch(error => {
        console.log("Room does not exist:" + error);
        if (lobbyExistsRef.current) {
          setLobbyExists(false);
          lobbyExistsRef.current = false;
        }
      });
  }, [lobbyId]);

  const checkRoomStateAndJoin = useCallback(() => {
    if (!lobbyId) return;

    api.whoIsInRoom(lobbyId)
      .then(players => {
        const joinedPlayers = players.filter((p) => p.name);
        setJoined(joinedPlayers);
        setLobbyExists(true);

        const notOrderedPlayer = [...Array(joinedPlayers.length).keys()]
          .find(i => !joinedPlayers.some(p => p.id === i));

        const metadataConnectionPlayer = players
          .find(p => [...Array(players.length).keys()]
            .some(id => p.data === sessionStorage.getItem(`metadata-${id}`)));

        // if (metadataConnectionPlayer !== undefined) {
        //   api.leaveRoom(
        //     lobbyId,
        //     metadataConnectionPlayer.id,
        //     sessionStorage.getItem(`localAuth-${metadataConnectionPlayer.id}`)
        //   );
        // }

        const myPlayerNum = metadataConnectionPlayer !== undefined
          ? metadataConnectionPlayer.id
          : (notOrderedPlayer !== undefined)
            ? notOrderedPlayer
            : joinedPlayers.length;

        setPlayerNumber(players.length);
        // Only auto-join if name has not been submitted yet
        if (!nameSubmitted && !myID) {
          setMyID(myPlayerNum);
        }
      })
      .catch(error => {
        console.log("Room does not exist" + error);
        setLobbyExists(false);
      });
  }, [lobbyId, joinRoom, nameSubmitted, myID]);

  const copyToClipboard = useCallback(() => {
    if (!gameLinkBoxRef.current) return;

    const textField = document.createElement("textarea");
    textField.innerText = gameLinkBoxRef.current.innerText;
    textField.style.opacity = "0";
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  useEffect(() => {
    checkRoomStateAndJoin();
    intervalRef.current = setInterval(checkRoomState, pollInterval);

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
      cleanup();
    };
  }, [checkRoomStateAndJoin, checkRoomState, cleanup, pollInterval]);

  return {
    joined,
    myID,
    userAuthToken,
    playerName,
    setPlayerName,
    nameSubmitted,
    setNameSubmitted,
    copied,
    lobbyExists,
    gameLinkBoxRef,
    joinRoom,
    checkRoomState,
    checkRoomStateAndJoin,
    copyToClipboard,
    clearPollInterval
  };
};
