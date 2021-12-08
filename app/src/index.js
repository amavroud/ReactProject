import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

class Grid extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      grid: [], //our array state
      whichPlayer: null, // will switch 1 or 2
      gameLive: true, //if game is live make picks can happen
      message: '', // used as prompts to notify win or no win scenarios 
    };
    this.makePick = this.makePick.bind(this);
  }
  
  //create empty grid
  createGrid(){
    let grid = []; //our grid made of rows 
    for(let i= 0; i<6;i++ ){
      let gridRow = []; // rows that will contain buttons
      for (let j=0; j<7; j++){
        gridRow.push(null);
      }
      grid.push(gridRow); //push our row created above
    }
    // used to reset all parts of the game for new play
    this.setState({
      grid,
      whichPlayer: 1,
      gameLive: true,
      message: ''
    });
  }

  checkWinner(grid){
    //check horizontal
    for(let i =0; i<6; i++){
      for(let j=0; j<4; j++){ //board is 7 wide, first instance of check will end at j[3]
        if(grid[i][j]!= null){
          if(grid[i][j] === grid[i][j+1] && grid[i][j] === grid[i][j+2] && grid[i][j] === grid[i][j+3]){
            return grid[i][j];// return winning cell
          }
        }
      }
    }
    //check vertical, stop at index[2] as a win is 4 in height and gid is 6 buttons high
    for(let i = 0; i<3; i++){
      for(let j = 0; j<7; j++){
        if(grid[i][j]!= null){
          if(grid[i][j] === grid[i+1][j] && grid[i][j] === grid[i+2][j] && grid[i][j] === grid[i+3][j]){
            return grid[i][j];
          }
        }
      }
    }
  }
  //check if gridisFull but nowinners
  fullGrid(grid){
    for(let i = 0; i < 6; i++){
      for(let j = 0; j <7; j++){
        if(grid[i][j] == null){
          return false; // no the grid isnt full we found a null
        }
      }
    }
    return true; // if we make it here grid is full
  }

  makePick(row,column){
    if(this.state.gameLive){ // is the game still live ie. no winner yet
      let grid = this.state.grid; //grid we use is reference the state about grid
      if(grid[row][column] == null){ // as long as the button hasn't been picked we can trigger the following statements
        grid[row][column] = this.state.whichPlayer; //input into that cell in the table as that players choice
        let isThereAWinner = this.checkWinner(this.state.grid); //trigger the for loops for vert and horiz check
        if(isThereAWinner === 1){
          this.setState({grid, gameLive: false, message: 'Player 1 Win. Press Start to play again.'}); // like below but for player 1
        } else if (isThereAWinner === 2){
          this.setState({grid, gameLive: false, message: 'Player 2 Win. Press Start to play again.'}); //update the gamelive state to false and prompt user
        }
        else if(this.fullGrid(this.state.grid)){
          this.setState({grid, gameLive: false, message: 'No Winners. Press Start to play again.'}); // this is the full grid edge case of no winner
        }else{
          this.setState({grid, whichPlayer: this.switchTurn()}); // no winners, whichplayer state refers back to the switchTurn funciton to swap player to make next pick
        }
        
      }
    }
  }

  switchTurn(){
    // if we are player 1 make us 2 or vice versa
    return (this.state.whichPlayer === 1) ? this.state.whichPlayer = 2 : this.state.whichPlayer = 1;
  }

  render(){
    return(
      <div>
        <button onClick={() => this.createGrid()}>Start</button>
        <table>
          {this.state.grid.map((row,i) => (<GridRow key ={i} index={i} whatRow={row} makePick={this.makePick}/>))}
        </table>  
        <div>{this.state.message}</div>  
      </div>
    )
  }
}

// 6 rows will make up the grid
const GridRow = ({whatRow, makePick, index}) => {
  return (
    <tr> 
    {whatRow.map((cell, i) => <GridButton key={i} whatPlayer={cell} rowIndex={index} colIndex={i} makePick={makePick} />)}
    </tr>
  );
};

//button will make up 7 slots in row
const GridButton = ({whatPlayer, rowIndex,colIndex, makePick}) =>{
  let color = 'grey'; //default colour
  if(whatPlayer === 1){ //player 1s colours are yellow, player 2 red
      color = 'yellow';
  }
  else if(whatPlayer === 2){
      color = 'red';
  }
  //assign the name of button to color of who it was set by, and call the make pick so proper button is inputted with player no that picked it
  // fill the button with a div style x that changes color according to the player that picked, player 1 will show a yellow x for selection, red for 2, grey when the player hasnt selected a button
  return(
    <td>
        <button onClick={() => 
        {
          makePick(rowIndex,colIndex);
        }}> 
          <div style={{backgroundColor: color}}>X</div>
        </button>
    </td>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
    <Grid></Grid>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();