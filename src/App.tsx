import { useState, useEffect } from 'react'
import './App.css'

export type SquareValue = 'X' | 'O' | null;
export type GameMode = 'pvp' | 'pvc';
export type Difficulty = 'easy' | 'medium' | 'hard';

function App() {
  const [squares, setSquares] = useState<SquareValue[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameStarted, setGameStarted] = useState(false);
  const winner = calculateWinner(squares);

  // Computer's turn logic
  useEffect(() => {
    if (gameMode === 'pvc' && !xIsNext && !winner && !squares.every(square => square) && gameStarted) {
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
  }, [squares, xIsNext, gameMode, winner, difficulty, gameStarted]);

  function handleClick(i: number) {
    if (winner || squares[i] || (gameMode === 'pvc' && !xIsNext)) return;
    
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
    if (mode === 'pvp') {
      setGameStarted(true);
    }
    resetGame();
  }

  const status = winner 
    ? `Winner: ${winner}`
    : squares.every(square => square) 
      ? "Game Over - It's a draw!"
      : `Next player: ${xIsNext ? 'X' : 'O'}`;

  if (!gameMode) {
    return (
      <div className="game">
        <h1>Tic Tac Toe</h1>
        <div className="mode-selection">
          <h2>Select Game Mode</h2>
          <button className="mode-button" onClick={() => startNewGame('pvp')}>
            Player vs Player
          </button>
          <button className="mode-button" onClick={() => startNewGame('pvc')}>
            Player vs Computer
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'pvc' && !gameStarted) {
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
          Mode: {gameMode === 'pvp' ? 'Player vs Player' : `Player vs Computer (${difficulty})`}
        </div>
      </div>
      <div className="board">
        {squares.map((square, i) => (
          <button
            key={i}
            className="square"
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

export function calculateWinner(squares: SquareValue[]): SquareValue {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Computer AI logic with different difficulty levels
export function findComputerMove(squares: SquareValue[], difficulty: Difficulty): number {
  switch (difficulty) {
    case 'easy':
      return findEasyMove(squares);
    case 'medium':
      return findMediumMove(squares);
    case 'hard':
      return findHardMove(squares);
  }
}

export function findEasyMove(squares: SquareValue[]): number {
  // Just pick a random available move
  const availableSpaces = squares.map((square, i) => !square ? i : -1).filter(i => i !== -1);
  if (availableSpaces.length > 0) {
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  }
  return -1;
}

export function findMediumMove(squares: SquareValue[]): number {
  // Check for winning move
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const newSquares = squares.slice();
      newSquares[i] = 'O';
      if (calculateWinner(newSquares) === 'O') {
        return i;
      }
    }
  }

  // Block opponent's winning move
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const newSquares = squares.slice();
      newSquares[i] = 'X';
      if (calculateWinner(newSquares) === 'X') {
        return i;
      }
    }
  }

  // Take center if available
  if (!squares[4]) return 4;

  // Take any available space
  const availableSpaces = squares.map((square, i) => !square ? i : -1).filter(i => i !== -1);
  if (availableSpaces.length > 0) {
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  }

  return -1;
}

export function findHardMove(squares: SquareValue[]): number {
  // Check for winning move
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const newSquares = squares.slice();
      newSquares[i] = 'O';
      if (calculateWinner(newSquares) === 'O') {
        return i;
      }
    }
  }

  // Block opponent's winning move
  for (let i = 0; i < 9; i++) {
    if (!squares[i]) {
      const newSquares = squares.slice();
      newSquares[i] = 'X';
      if (calculateWinner(newSquares) === 'X') {
        return i;
      }
    }
  }

  // Take center if available
  if (!squares[4]) return 4;

  // Take corners if available
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter(i => !squares[i]);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available space
  const availableSpaces = squares.map((square, i) => !square ? i : -1).filter(i => i !== -1);
  if (availableSpaces.length > 0) {
    return availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  }

  return -1;
}

export default App
