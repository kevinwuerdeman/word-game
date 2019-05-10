import React from 'react';
import './App.css';


export const GameDisplay = (props) => {
  const {time, words, scoreBoard, letters, input, name, handleChange, handleSave, gameID, startGame, admin, leader} = props
  let disabled = time < 60 && time > 0 && input.length > 0;
  return (
    <div className="App">
    <header className="App-header">
    <div className="container">
      <div className="left-side">
        <div className="words">
        <h1 className="word-title">Played Words:</h1>
          <div className="inner-container">
            { words && Object.keys(words).map((key) => {
                return <li className="played-words" key={key}>{words[key].playerName + ' played:  "'+ words[key].wordContent +'"' }</li>
            })}
          </div>
        </div>
        <div className="letter-input">
          <h2> Letters: {letters}</h2>
          <h1 id="output">Input: </h1>
          <input type="textfield" name="input" id="latestStatus" value={input} onChange={handleChange}/>
          <button className="button" onClick={handleSave} disabled={!disabled}>Save</button>
        </div>
      </div>
      <div className="right-side">
        <h2>{time}</h2>
        { admin && <button className="button" onClick={startGame} >Start!</button> }
        <h1> Welcome To The Game: {name}</h1>
        {time === 0 && <h2> {leader.name} wins!!!</h2>}
        <div className="word-score">
          <div className="scoreBoard">
            <h2>Scoreboard:</h2>
              <div className="">
              { scoreBoard && Object.keys(scoreBoard).map((key) => {
                  return <li key={key}>{key} - points: {scoreBoard[key]}</li>
              })}
              </div>
          </div>
        </div>
      </div>
    </div>
    </header>
    <h5>Invite players with this link: http://localhost:3000/game/{gameID}</h5>
    </div>
  );
}

