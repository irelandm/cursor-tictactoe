import { calculateWinner, findComputerMove, findEasyMove, findMediumMove, findHardMove, type SquareValue, type WinnerInfo } from '../gameLogic';

// Helper function to create a properly typed board
const createBoard = (squares: (SquareValue)[]): SquareValue[] => squares;

describe('calculateWinner', () => {
  it('should return null for an empty board', () => {
    const squares = createBoard(Array(9).fill(null));
    const result = calculateWinner(squares);
    expect(result.winner).toBeNull();
    expect(result.line).toBeNull();
  });

  it('should detect horizontal wins', () => {
    const squares = createBoard(['X', 'X', 'X', null, null, null, null, null, null]);
    const result = calculateWinner(squares);
    expect(result.winner).toBe('X');
    expect(result.line).toEqual([0, 1, 2]);
  });

  it('should detect vertical wins', () => {
    const squares = createBoard(['O', null, null, 'O', null, null, 'O', null, null]);
    const result = calculateWinner(squares);
    expect(result.winner).toBe('O');
    expect(result.line).toEqual([0, 3, 6]);
  });

  it('should detect diagonal wins', () => {
    const squares = createBoard(['X', null, null, null, 'X', null, null, null, 'X']);
    const result = calculateWinner(squares);
    expect(result.winner).toBe('X');
    expect(result.line).toEqual([0, 4, 8]);
  });

  it('should return null for a draw', () => {
    const squares = createBoard(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']);
    const result = calculateWinner(squares);
    expect(result.winner).toBeNull();
    expect(result.line).toBeNull();
  });
});

describe('findComputerMove', () => {
  it('should return -1 for a full board', () => {
    const squares = createBoard(['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X']);
    expect(findComputerMove(squares, 'easy')).toBe(-1);
    expect(findComputerMove(squares, 'medium')).toBe(-1);
    expect(findComputerMove(squares, 'hard')).toBe(-1);
  });

  describe('findEasyMove', () => {
    it('should return a valid move index', () => {
      const squares = createBoard(['X', null, null, null, null, null, null, null, null]);
      const move = findEasyMove(squares);
      expect(move).toBeGreaterThanOrEqual(0);
      expect(move).toBeLessThan(9);
      expect(squares[move]).toBeNull();
    });
  });

  describe('findMediumMove', () => {
    it('should take winning move when available', () => {
      const squares = createBoard(['O', 'O', null, 'X', 'X', null, null, null, null]);
      expect(findMediumMove(squares)).toBe(2);
    });

    it('should block opponent winning move', () => {
      const squares = createBoard(['X', 'X', null, 'O', null, null, null, null, null]);
      expect(findMediumMove(squares)).toBe(2);
    });

    it('should take center when available', () => {
      const squares = createBoard(['X', null, null, null, null, null, null, null, null]);
      expect(findMediumMove(squares)).toBe(4);
    });
  });

  describe('findHardMove', () => {
    it('should take winning move when available', () => {
      const squares = createBoard(['O', 'O', null, 'X', 'X', null, null, null, null]);
      expect(findHardMove(squares)).toBe(2);
    });

    it('should block opponent winning move', () => {
      const squares = createBoard(['X', 'X', null, 'O', null, null, null, null, null]);
      expect(findHardMove(squares)).toBe(2);
    });

    it('should take center when available', () => {
      const squares = createBoard(['X', null, null, null, null, null, null, null, null]);
      expect(findHardMove(squares)).toBe(4);
    });

    it('should prefer corners over edges', () => {
      const squares = createBoard(['X', null, null, null, 'O', null, null, null, null]);
      const move = findHardMove(squares);
      expect([0, 2, 6, 8]).toContain(move);
    });
  });
}); 