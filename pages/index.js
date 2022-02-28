import { useEffect, useState } from "react";

export default function Home() {
  const [Input, setInput] = useState("");
  const [Word, setWord] = useState("TESTE");
  const [Attempts, setAttepmts] = useState([]);
  const [FoundChars, setFoundChars] = useState([]);
  const [RightPositionChars, setRightPositionChars] = useState([]);
  const [WrongChars, setWrongChars] = useState([]);

  const charsRows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  function handleTry() {
    setAttepmts((old) => [...old, Input]);

    var foundChars = [];
    var rightPositionChars = [];
    var wrongChars = [];

    Input.split("").forEach((char, index) => {
      if (Word.includes(char) && !foundChars.includes(char)) {
        foundChars.push(char);
      }

      if (Word[index] === char) rightPositionChars.push(char);

      if (!Word.includes(char)) wrongChars.push(char);
    });

    setFoundChars((old) => [...new Set(old.concat(foundChars))]);
    setRightPositionChars((old) => [...new Set(old.concat(rightPositionChars))]);
    setWrongChars((old) => [...new Set(old.concat(wrongChars))]);

    setInput("");
  }

  useEffect(() => {
    setAttepmts([]);
    setInput("");
    setFoundChars([]);
    setRightPositionChars([]);
    setWrongChars([]);
  }, [Word]);

  return (
    <>
      <div>
        <input value={Input} onChange={(e) => setInput(e.target.value.toUpperCase())} maxLength={5} minLength={5} />
        <button onClick={handleTry}>ENTER</button>
      </div>
      <br />

      <div>
        {Attempts.map((att, index) => (
          <div key={index}>
            {att.split("").map((char, index2) => {
              if (FoundChars.includes(char)) {
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
      <br />
      <br />

      <div>
        {charsRows.map((row, index) => (
          <div key={index}>
            {row.map((char, index2) => {
              if (FoundChars.includes(char)) {
                if (RightPositionChars.includes(char)) {
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

              if (WrongChars.includes(char)) {
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
      <br />

      <div>{FoundChars}</div>
      <div>{RightPositionChars}</div>
      <br />

      <div>
        <h3>Trocar palavra:</h3>
        <input value={Word} onChange={(e) => setWord(e.target.value.toUpperCase())} maxLength={5} minLength={5} />
      </div>
    </>
  );
}
