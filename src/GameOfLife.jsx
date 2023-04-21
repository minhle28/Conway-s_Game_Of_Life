import React, { Component } from 'react';

let timer = null;
class GameOfLife extends Component {
  constructor(props) {
    super(props);
    let rows=25;
    let cols=25;
    this.state = {
      rows: rows,
      cols: cols,
      grid: Array(rows).fill().map(() => Array(cols).fill(false)),
      generation: 0,
      isRunning: false,
      population: 0,
      animationSpeed: 1000,
      interation: -1
    };
    this.startGame();
  }
  startGame() {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setInterval(() => {
      if (this.state.isRunning === true) {
        this.updateGrid();
        if (this.state.interation !== -1) {
          this.setState({ isRunning: false, interation: -1 });
        }        
      }
    }, this.state.animationSpeed);
  }
  handleStartClick = (event) => {
    this.setState({ isRunning: true });
  }

  handleStopClick = (event) => {
    this.setState({ isRunning: false });
  }

  handleIncrementClick(number) {
    this.setState({ isRunning: true, interation: number });
  }

  handleResetClick = (event) => {
    this.setState({
      grid: Array(this.state.rows).fill().map(() => Array(this.state.cols).fill(false)),
      generation: 0,
      population: 0,
      isRunning: false,
    });
  }
   
  handlePatternChange = (event) => {
    if (this.state.isRunning) {
      return;
    }
    let patternName = event.target.value;
    let random = Array(this.state.rows).fill().map(() => Array(this.state.cols).fill(false))
    for (let i = 0; i < this.state.rows;i++)
      for (let j = 0; j < this.state.cols;j++){
        random[i][j] = Math.random() < 0.5;
      }
    let patterns = {
      glider: [
        [false, true, false],
        [false, false, true],
        [true, true, true],
      ],
      blinker: [
        [false, true, false],
        [false, true, false],
        [false, true, false],
      ],
      toad: [
        [false, false, false, false],
        [false, true, true, true],
        [true, true, true, false],
        [false, false, false, false],
      ],
      beacon: [
        [true, true, false, false],
        [true, true, false, false],
        [false, false, true, true],
        [false, false, true, true],
      ],
      pulsar: [
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
        [false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [true, false, false, false, false, true, false, true, false, false, false, false, true],
        [false, false, false, false, false, false, false, false, false, false, false, false, false],
        [false, false, true, true, true, false, false, false, true, true, true, false, false],
      ],
      random: random,
    };
    console.log(patterns);
    let pattern = patterns[patternName];
    let rowOffset = Math.floor((this.state.rows - pattern.length) / 2);
    let colOffset = Math.floor((this.state.cols - pattern[0].length) / 2);

    let newGrid = Array(this.state.rows).fill().map(() => Array(this.state.cols).fill(false)).map((row, rowIndex) => {
      if (rowIndex < rowOffset || rowIndex >= rowOffset + pattern.length) {
        return row;
      }
      return row.map((cell, colIndex) => {
        if (colIndex < colOffset || colIndex >= colOffset + pattern[0].length) {
          return cell;
        }
        return pattern[rowIndex - rowOffset][colIndex - colOffset];
      });
    });
    this.setState({
      grid: newGrid,
      population: pattern.reduce((acc, row) => acc + row.reduce((acc, cell) => acc + (cell ? 1 : 0), 0), 0)
    });
  }
  handleSpeedChange = (event) =>{
    this.setState({ animationSpeed: event.target.value });
    if(timer){
      window.clearTimeout(timer);
      this.startGame();
    }
  }
  handleCellChange(rowIndex, colIndex, cell) {
    if (this.state.isRunning) {
      this.handleStopClick();
    }
    let newGrid = [...this.state.grid];
    newGrid[rowIndex][colIndex] = !newGrid[rowIndex][colIndex];
    this.setState({
      grid: newGrid,
      population: (cell ? this.state.population - 1 : this.state.population + 1)
    });
    console.log(this.state);
  }
  // extra function
  countNeighbors(grid,row, col) {
    let currentGrid = grid;
    let rows = this.state.rows;
    let cols = this.state.cols;
    let count = 0;
    for (let i = -1; i <= 1; i++)
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0)
          continue;
        let r = (row + i);
        let c = (col + j);
        if (r < 0 || r >= rows || c < 0 || c >= cols)
          continue;
        if (currentGrid[r][c]) {
          count++;
        }
      }
    return count;
  }

  updateGrid() {
    if (this.setState.isRunning === false)
      return;
    let currentGrid = this.state.grid;
    let rows = this.state.rows;
    let cols = this.state.cols;
    let newGrid = Array(rows).fill().map(() => Array(cols).fill(false));
    let newPopulation = 0;
    let interation = (this.state.interation === -1 ? 1 : this.state.interation);
    for (let i = 0; i < interation; i++) {
      newGrid = Array(rows).fill().map(() => Array(cols).fill(false));
      newPopulation = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let neighbors = this.countNeighbors(currentGrid,r, c);
          if (currentGrid[r][c]) {
            if (neighbors === 2 || neighbors === 3) {
              newGrid[r][c] = true;
              newPopulation++;
            }
          } else {
            if (neighbors === 3) {
              newGrid[r][c] = true;
              newPopulation++;
            }
          }
        }
      }
      currentGrid = newGrid;
    }
    this.setState({
      grid: newGrid,
      population: newPopulation,
      generation: this.state.generation + interation,
    });
  }
  render() {
    return (
      <div id="game-context">
        <h1>Conway's Game of Life</h1>
        <div id='both_side'>
          <div id="left_side">
            <h2>Controls</h2>
            <hr/>
            <div className="controls">
              <div className='center'>
                <button onClick={this.handleStartClick} disabled={this.state.isRunning}>
                  Start
                </button>
                <button onClick={this.handleStopClick} disabled={!this.state.isRunning}>
                  Stop
                </button>
              </div>
              <br />

              <div className='center'>
                <button onClick={() => this.handleIncrementClick(1)} disabled={this.state.isRunning}>
                  Increment 1 Generation
                </button>
              </div>
              <br />

              <div className='center'>
                <button onClick={() => this.handleIncrementClick(23)} disabled={this.state.isRunning}>
                  Increment 23 Generations
                </button>
              </div>
              <br />

              <div className='center'>
                <button onClick={this.handleResetClick}>
                  Reset
                </button>
              </div>
              <br /> 

              <div className='center'>
                <select onChange={this.handlePatternChange}>
                  <option value="">Select a pattern</option>
                  <option value="glider">Glider</option>
                  <option value="blinker">Blinker</option>
                  <option value="toad">Toad</option>
                  <option value="beacon">Beacon</option>
                  <option value="pulsar">Pulsar</option>
                  <option value="random">Random</option>
                </select>
              </div>
              <br />

              <div className='center'>
                <label>
                  Animation speed: Fast{' '}
                  <input type="range" min="200" max="1000" step="1" value={this.state.animationSpeed} onChange={this.handleSpeedChange} />
                  {' '}Slow
                </label>
              </div>
            </div>
          </div>
          <div id='right_side'>
            <div id='toggle'>
              <div className="generation">Generation: {this.state.generation}</div>
              <div className="population">Population: {this.state.population}</div>
            </div>
            <table className="gameTable">
              <tbody>
              {this.state.grid.map((row, rowIndex) => (
                <tr>
                  {row.map((cell, colIndex) => (
                    <td key={colIndex} className={cell ? 'alive' : 'dead'} onClick={() => this.handleCellChange(rowIndex, colIndex, cell)}></td>
                  ))}
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    );
  }

}

export default GameOfLife;