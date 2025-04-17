import { useState, useEffect } from 'react'
import './App.css'
import { type SquareValue, type GameMode, type Difficulty, calculateWinner, findComputerMove, type WinnerInfo } from './gameLogic'

function App() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const winInfo = calculateWinner(squares);

  // Computer's turn logic
  useEffect(() => {
    if (gameMode === 'computer' && !xIsNext && !winInfo.winner && !squares.every(square => square) && gameStarted) {
      const timer = setTimeout(() => {
        const computerMove = findComputerMove(squares, difficulty);
        if (computerMove !== -1) {
          const newSquares = squares.slice();
          newSquares[computerMove] = 'O';
          setSquares(newSquares);
          setXIsNext(true);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [squares, xIsNext, gameMode, winInfo.winner, difficulty, gameStarted]);

  function handleClick(i: number) {
    if (winInfo.winner || squares[i] || (gameMode === 'computer' && !xIsNext)) return;
    
    const newSquares = squares.slice();
    newSquares[i] = xIsNext ? 'X' : 'O';
    setSquares(newSquares);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameStarted(false);
  }

  function startNewGame(mode: GameMode) {
    setGameMode(mode);
    if (mode === 'player') {
      setGameStarted(true);
    }
    resetGame();
  }

  const status = winInfo.winner 
    ? `Winner: ${winInfo.winner}`
    : squares.every(square => square) 
      ? "Game Over - It's a draw!"
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  if (!gameMode) {
    return (
      <div className="game">
        <h1>Tic Tac Toe</h1>
        <div className="mode-selection">
          <h2>Select Game Mode</h2>
          <button className="mode-button" onClick={() => startNewGame('player')}>
            Player vs Player
          </button>
          <button className="mode-button" onClick={() => startNewGame('computer')}>
            Player vs Computer
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'computer' && !gameStarted) {
    return (
      <div className="game">
        <h1>Tic Tac Toe</h1>
        <div className="mode-selection">
          <h2>Select Difficulty</h2>
          <button 
            className={`difficulty-button ${difficulty === 'easy' ? 'selected' : ''}`}
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </button>
          <button 
            className={`difficulty-button ${difficulty === 'medium' ? 'selected' : ''}`}
            onClick={() => setDifficulty('medium')}
          >
            Medium
          </button>
          <button 
            className={`difficulty-button ${difficulty === 'hard' ? 'selected' : ''}`}
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </button>
          <button className="start-button" onClick={() => {
            setGameStarted(true);
            setXIsNext(true);
          }}>
            Start Game
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game">
      <h1>Tic Tac Toe</h1>
      <div className="game-info">
        <div className="status">{status}</div>
        <div className="mode-indicator">
          Mode: {gameMode === 'player' ? 'Player vs Player' : `Player vs Computer (${difficulty})`}
        </div>
      </div>
      <div className="board">
        {squares.map((square, i) => (
          <button
            key={i}
            className={`square ${winInfo.line?.includes(i) ? 'winning' : ''}`}
            onClick={() => handleClick(i)}
            data-value={square}
          >
            {square}
          </button>
        ))}
      </div>
      <div className="controls">
        <button className="reset" onClick={resetGame}>
          Reset Game
        </button>
        <button className="reset" onClick={() => setGameMode(null)}>
          Change Mode
        </button>
      </div>
    </div>
  );
}

export default App
