import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";

let socket;

export default function Home() {
  const router = useRouter();
  const { roomId } = router.query;

  const [Input, setInput] = useState("");
  const [Word, setWord] = useState("TESTE");

  const [Name, setName] = useState("");
  const [User, setUser] = useState(null);
  const [Users, setUsers] = useState([]);

  const charsRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  useEffect(() => {
    (async () => {
      if (roomId) {
        await fetch("/api/socket");
        socket = io();

        socket.on("update-room", (users) => updateUsers(users));
        socket.on("user-created", (user) => updateUser(user));

        const userNick = localStorage.getItem("userNick");

        createUser(userNick);
      }
    })();
  }, [router]);

  function createUser(userNick) {
    if (userNick) socket.emit("create-user", { roomId, userNick });
  }

  function updateUsers(users) {
    const userNick = localStorage.getItem("userNick");
    setUsers(users);
    setUser(users.filter((x) => x.userNick === userNick)[0]);
    console.log({ users });
  }

  function updateUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
    //joinRoom(user);
  }

  function joinRoom(user) {
    socket.emit("join-room", { roomId: Number(roomId), user });
  }

  function handleJoinRoom() {
    localStorage.setItem("userNick", Name);
    createUser(Name);
  }

  function handleTry() {
    socket.emit("try", { roomId, user: User, word: Input });

    // setAttepmts((old) => [...old, Input]);

    // var foundChars = [];
    // var rightPositionChars = [];
    // var wrongChars = [];

    // Input.split("").forEach((char, index) => {
    //   if (Word.includes(char) && !foundChars.includes(char)) {
    //     foundChars.push(char);
    //   }

    //   if (Word[index] === char) rightPositionChars.push(char);

    //   if (!Word.includes(char)) wrongChars.push(char);
    // });

    // setFoundChars((old) => [...new Set(old.concat(foundChars))]);
    // setRightPositionChars((old) => [...new Set(old.concat(rightPositionChars))]);
    // setWrongChars((old) => [...new Set(old.concat(wrongChars))]);

    setInput("");
  }

  useEffect(() => {
    setInput("");
    // setAttepmts([]);
    // setFoundChars([]);
    // setRightPositionChars([]);
    // setWrongChars([]);
  }, [Word]);

  return (
    <div>
      {!User && (
        <div className="mb-5">
          <input className="border py-2 px-4" placeholder="Nickname" value={Name} onChange={(e) => setName(e.target.value)} />
          <button className="border bg-blue-400 rounded py-2 px-4 text-white" onClick={handleJoinRoom}>
            Join Room
          </button>
        </div>
      )}

      {User && (
        <>
          <div className="mb-5">
            <input className="border" value={Input} onChange={(e) => setInput(e.target.value.toUpperCase())} maxLength={5} minLength={5} />
            <button onClick={handleTry}>ENTER</button>
          </div>

          <div className="mb-5">
            {User.attempts.map((att, index) => (
              <div key={index}>
                {att.split("").map((char, index2) => {
                  if (User.foundChars.includes(char)) {
                    if (Word[index2] === char) {
                      return (
                        <b style={{ color: "#3aa394" }} key={index2}>
                          {char}
                        </b>
                      );
                    }

                    return (
                      <b style={{ color: "#d3ad69" }} key={index2}>
                        {char}
                      </b>
                    );
                  }

                  return <span key={index2}>{char}</span>;
                })}
              </div>
            ))}
          </div>

          <div className="mb-5">
            {charsRows.map((row, index) => (
              <div key={index}>
                {row.map((char, index2) => {
                  if (User.foundChars.includes(char)) {
                    if (User.rightPositionChars.includes(char)) {
                      return (
                        <b style={{ color: "#3aa394" }} key={index2}>
                          {char}
                        </b>
                      );
                    }

                    return (
                      <b style={{ color: "#d3ad69" }} key={index2}>
                        {char}
                      </b>
                    );
                  }

                  if (User.wrongChars.includes(char)) {
                    return (
                      <b style={{ color: "#F65460" }} key={index2}>
                        {char}
                      </b>
                    );
                  }

                  return <b key={index2}>{char}</b>;
                })}
              </div>
            ))}
          </div>

          <div className="mb-5">
            <div>{User.foundChars}</div>
            <div>{User.rightPositionChars}</div>
          </div>

          <div className="mb-5">
            <h3>Trocar palavra:</h3>
            <input value={Word} onChange={(e) => setWord(e.target.value.toUpperCase())} maxLength={5} minLength={5} />
          </div>

          <div className="mb-5">
            <h3>Users:</h3>
            {Users.map((user, index) => {
              if (user.id === User.id)
                return (
                  <div key={index} className="text-blue-400">
                    {user.userNick}
                  </div>
                );
              else return <div key={index}>{user.userNick}</div>;
            })}
          </div>
        </>
      )}
    </div>
  );
}
