import { useState } from 'react';
import Button from '@mui/material/Button';


import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import ConfettiComponent from './Confetti'; 



function Square({value, onSquareClick}) {
  return <button className="square" onClick={onSquareClick}>{value}</button>
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0;i < lines.length ; i++ ) {
    const [a, b, c] = lines[i];
    if(squares[a] && squares[a]===squares[b] && squares[a]===squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function Board({xIsNext, squares, onPlay}) {

  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else if (squares.every(square => square !== null)) { 
    status = "It's a draw!";
  } else {
    status = "Next Player: " + (xIsNext ? " X" : "O");
  }

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status"><h2>{status}</h2></div>
    {[0, 1, 2].map(rowIndex => (
      <div key={rowIndex} className="board-row">
        {[0, 1, 2].map(colIndex => {
          const index = rowIndex * 3 + colIndex;
          return (
            <Square
              key={index}
              value={squares[index]}
              onSquareClick={() => handleClick(index)}
            />
          );
        })}
      </div>
    ))}
    </>
  )
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
 

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove+1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move === history.length-1) {
      description = "You are at move: " + move;
    }
    else if (move>0) {
      description = "Go to move: " + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move} style={{ listStyleType: 'none', padding: 0 }}>
        <Button variant="contained" onClick={()=>jumpTo(move)} style={{marginBottom:'5%'}}>{description}</Button>
      </li>
    );
  });
  const winner = calculateWinner(currentSquares);
  return (
    <>
      <Container style={{marginBottom: '50px'}}>
        <Typography variant="h3" style={{textAlign:'center' , color: 'black', fontFamily: 'Pacifico, cursive', marginTop: '20px', marginBottom:'10%' }}>Tic Tac Toe Game</Typography>
        <div className='ggame' style={{textAlign:'center'}}>
        <Grid container spacing={2}>
          <Grid size={8} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className='game-board'>
              <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
          </Grid>

          <Grid size={4}>
            <h2 style={{textAlign:'center'}}>Game History</h2>
            <div className='game-info'>
              <ol>{moves}</ol>
            </div>
          </Grid>
        </Grid>
        </div>
      </Container>
      {winner && <ConfettiComponent />}
    </>
  )
}