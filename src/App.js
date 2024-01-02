import { useState } from "react";
import "./App.css";

/**
 * ボード１マス分のコンポーネント
 * 
 */
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>{ value }</button>
  );
}

/**
 * ボード全体のコンポーネント
 * 
 */
function Board({ xIsNext, squares, onPlay }) {
  // クリック時処理
  function handleClick(i) {
    if(calculateWinner(squares) || squares[i]){
      return;
    }
    const nextSquares = squares.slice();
    if(xIsNext){
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  // 勝敗判定
  const winner = calculateWinner(squares);
  let status;
  if(winner){
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  // ボード(行)を作成する処理
  const boardRows = [];
  for(let row = 0; row < 3; row++){
    const squareRow =[];
    // 各行内の列を作成
    for(let col = 0; col < 3; col++){
      const index = row * 3 + col;
      squareRow.push(
        <Square key={index} value={squares[index]} onSquareClick={() => handleClick(index)}/>
      );
    }
    boardRows.push(
      <div key={row} className="board-row">{squareRow}</div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
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
      return squares[a];
    }
  }
  return null;
}

/**
 * メインのコンポーネント
 * 
 */
export default function Game(){
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  //過去の情報へジャンプできるボタン作成処理
  const moves = history.map((squares, move) => {
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
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      );
    }
  });

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
        <ol>{moves}</ol>
      </div>
    </div>
  );
}