export type SquareValue = 'X' | 'O' | null;
export type GameMode = 'player' | 'computer';
export type Difficulty = 'easy' | 'medium' | 'hard';

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
  const emptySquares = squares
    .map((square, index) => (square === null ? index : -1))
    .filter((index) => index !== -1);
  return emptySquares.length > 0 ? emptySquares[Math.floor(Math.random() * emptySquares.length)] : -1;
}

export function findMediumMove(squares: SquareValue[]): number {
  // Check for winning move
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const newSquares = [...squares];
      newSquares[i] = 'O';
      if (calculateWinner(newSquares) === 'O') {
        return i;
      }
    }
  }

  // Check for blocking move
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const newSquares = [...squares];
      newSquares[i] = 'X';
      if (calculateWinner(newSquares) === 'X') {
        return i;
      }
    }
  }

  // Take center if available
  if (squares[4] === null) {
    return 4;
  }

  // Take any available corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((corner) => squares[corner] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available edge
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter((edge) => squares[edge] === null);
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }

  return -1;
}

export function findHardMove(squares: SquareValue[]): number {
  // Check for winning move
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const newSquares = [...squares];
      newSquares[i] = 'O';
      if (calculateWinner(newSquares) === 'O') {
        return i;
      }
    }
  }

  // Check for blocking move
  for (let i = 0; i < 9; i++) {
    if (squares[i] === null) {
      const newSquares = [...squares];
      newSquares[i] = 'X';
      if (calculateWinner(newSquares) === 'X') {
        return i;
      }
    }
  }

  // Take center if available
  if (squares[4] === null) {
    return 4;
  }

  // Take any available corner
  const corners = [0, 2, 6, 8];
  const availableCorners = corners.filter((corner) => squares[corner] === null);
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }

  // Take any available edge
  const edges = [1, 3, 5, 7];
  const availableEdges = edges.filter((edge) => squares[edge] === null);
  if (availableEdges.length > 0) {
    return availableEdges[Math.floor(Math.random() * availableEdges.length)];
  }

  return -1;
} 