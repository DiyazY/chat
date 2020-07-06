import React, { useState, useRef } from "react";
import "./App.css";
import Groups from "./components/Groups";

function App() {
  const name = useRef("");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    name.current = e.target.value;
  };

  const changePlayerName = () => {
    localStorage.setItem("_name", name.current);
    setPlayerName(name.current);
  };

  const [playerName, setPlayerName] = useState(localStorage.getItem("_name"));

  return (
    <div className="App">
      {playerName ? (
        <Groups userName={playerName} />
      ) : (
        <header className="App-header">
          F
          <input
            type="text"
            onChange={onChangeName}
            placeholder="Type name"
          ></input>
          <button onClick={changePlayerName}>connect</button>
        </header>
      )}
    </div>
  );
}

export default App;
