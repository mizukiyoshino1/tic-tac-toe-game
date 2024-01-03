import { useState } from "react";
import "./App.css";

/**
 * Squareコンポーネント
 * 
 */
function Square({ value, onSquareClick, isWinnerSquare }) {
  const squareStyle = isWinnerSquare ? { background: '#6699FF'} : {};

  return (
    <button
      className="square"
      onClick={onSquareClick}
      style={squareStyle}
    >
      { value }
    </button>
  );
}

/**
 * Boardコンポーネント
 * 
 */
function Board({ xIsNext, squares, onPlay }) {
  // ゲーム状況表示用ステータス
  const result = calculateWinner(squares);
  const winner = result ? result.winner : null;
  const winningSquares = result ? result.winningSquares : [];
  let status;
  if(winner){
    status = "Winner: " + winner;
  } else if (!winner && squares.every(array => array !== null)) {
    status = "Draw!!";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // ボードを作成する処理
  const renderBoardRows = () => {
    // 行を作成
    const boardRows = [];
    for(let row = 0; row < 3; row++){
      const squareRow =[];
      // 各行内の列を作成
      for(let col = 0; col < 3; col++){
        const index = row * 3 + col;
        const isWinnerSquare = winner && winningSquares.includes(index);

        squareRow.push(
          <Square 
            key={index}
            value={squares[index]}
            onSquareClick={() => handleClick(index)}
            isWinnerSquare={isWinnerSquare}
          />
        );
      }
      boardRows.push(
        <div key={row} className="board-row">{squareRow}</div>
      );
    }
    return boardRows;
  };

  // ボードクリック処理
  const handleClick = (i) => {
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>
      {renderBoardRows()}
    </>
  )
}

/**
 * 勝敗判定処理
 * 
 */
function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  for(let i = 0;i < lines.length; i++){
    const [a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return {winner: squares[a], winningSquares: lines[i]};
    }
  }
  return null;
}

/**
 * MoveButtonコンポーネント
 * 
 */
function MoveButton({ move, currentMove, onClick}){
  let description;
    if(move > 0 && move === currentMove){
      description = 'You are at move #' + move;
    } else if(move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }

    // ボタン or 文字列の表示制御
    if(move > 0 && move === currentMove){
      return (
        <li key={move}>
          <p>{description}</p>
        </li>
      )
    } else {
      return (
        <li key={move}>
          <button onClick={() => onClick(move)}>{description}</button>
        </li>
      );
    }
}

/**
 * Moveコンポーネント
 * 
 */
function Moves({ history, currentMove, jumpTo }){
  const [isAscending, setAscending] = useState(true);

  // 昇順降順変更処理
  const toggleOrder = () => {
    setAscending(!isAscending);
  }

  // MoveButton生成
  const moveButtons = history.slice().reverse().map((squares, move) => (
    <MoveButton key={move} move={move} currentMove={currentMove} onClick={jumpTo} />
  ));

  return (
    <>
      <button onClick={toggleOrder} className="toggle-button">toggleOrder</button>
      <ol>{ isAscending ? moveButtons : moveButtons.reverse()}</ol>
    </>
  );
}

/**
 * Gameコンポーネント
 * 
 */
export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  //ボートクリック時の処理
  function handlePlay(nextSquares){
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  //過去の情報へ戻る処理
  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
      </div>
      <div className="game-info">
        <Moves history={history} currentMove={currentMove} jumpTo={jumpTo} />
      </div>
    </div>
  );
}