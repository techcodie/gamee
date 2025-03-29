import React, { use, useState } from "react";
import "./App.css";
import { useEffect } from "react";
import confetti from "canvas-confetti";

function App() {
  let gridSize = 4;
  const generateBoard = () => {
    let numbers = Array.from({ length: gridSize * gridSize }, (_, i) => i);
    numbers.sort(() => Math.random() - 0.5);
    return numbers;
  };
  const [tiles, setTiles] = useState(generateBoard());
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const emptyIndex = tiles.indexOf(0);

useEffect(() => { 
  if (checkWin(tiles)) {
    triggerConfetti();
    setGameWon(true);
  } 
}, [tiles]);

  const handleMove = (index) => {
    if (gameWon) return;
    const row = Math.floor(index / gridSize);
    const col = index % gridSize;
    const emptyRow = Math.floor(emptyIndex / gridSize);
    const emptyCol = emptyIndex % gridSize;

    if (
      (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
      (Math.abs(col - emptyCol) === 1 && row === emptyRow)
    ) {
      let newTiles = [...tiles];
      [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
      setTiles(newTiles);
      setMoves(moves + 1);
      if (checkWin(newTiles)) {
        setGameWon(true);
      }
    }
  };

  const checkWin = (tilesArray) => {
    return tilesArray.every((tile, index) => (tile === index+1)||(tile === 0));
  };

  const resetGame = () => {

    console.log(gridSize);
    setTiles(generateBoard());
    setMoves(0);
    setGameWon(false);
  };
  
  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }, // Starts from middle
    });
  };

  return (
    <div className="container">
      <div className="game-wrapper">
  <h1 className="title">Sliding Puzzle Game 🧩</h1>
    </div>
    <div>
      <h2>Moves: {moves}</h2>
      <div className="puzzle-container" style={{ gridTemplateColumns: `repeat(${gridSize}, 100px)`}}>
        {tiles.map((tile, index) => (
          <div
            key={index}
            className={`tile ${tile === 0 ? "empty" : ""}`}
            onClick={() => handleMove(index)}
            style={
              tile !== 0
                ? {
                   
                    backgroundSize: `${gridSize * 100}px ${gridSize * 100}px`,
                    backgroundPosition: `${(tile % gridSize) * -100}px ${Math.floor(tile / gridSize) * -100}px`,
                  }
                : {}
            }
          >
            {tile !== 0 ? tile : ""}
          </div>
        ))}
      </div>
      {gameWon && <p className="win-message">🎉 You won! 🎉</p>}
      <button className="reset-button" onClick={resetGame}>Restart</button>
    </div>
    </div>
  );
}

export default App;

