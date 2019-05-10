import React from 'react';
import './App.css';
import { GameDisplay } from "./GameDisplay";
import firebase from "firebase/app";


class App extends React.Component {
  state = {
    name: '',
    input: '',
    gameID: '',
    words: {},
    letters: [],
    players: 0,
    time: 60,
    gameStart: false,
    scoreBoard: {},
    leader: {name: "player 1", score: 0}
  }

  gameRef = firebase.database().ref().child('games').child(this.props.match.params.id);;
  wordRef = firebase.database().ref().child('words').child(this.props.match.params.id);
  playerRef = firebase.database().ref().child('players').child(this.props.match.params.id);


  componentDidMount() {
    this.wordRef.on('value', this.handleNewWords);
    this.setState({gameID: this.props.match.params.id})
    this.playerRef.on('value', this.handlePlayer);
    this.gameRef.on('value', this.handleGame);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.gameID && this.state.gameID) {
      this.playerRef.push().set({name: `player ${this.state.players +=1 }`})
      }
    }

  checkEntry = (word) => {
    let tempword = [].concat(this.state.letters);
    for (let i = 0; i < word.length; i++) {
      if (tempword.indexOf(word[i]) === -1) {
        return false;
      } else {
        tempword.splice(tempword.indexOf(word[i]),1);
      }
    }
    return true;
  }

  handlePlayer = (snapshot) => {
    if(this.state.gameID && !this.state.name) {
      const playerCount = Object.keys(snapshot.val()).length
      this.setState({players: playerCount, name:`player ${playerCount}`})
    }
  }

  handleGame = (snapshot) => {
    if (this.state.gameID) {
      this.setState({gameStart: snapshot.val().gameStart, letters: snapshot.val().letters}, () => {
        if (this.state.gameStart && this.state.time > -1) {
          let start = Date.now();
          let id = setInterval(() => {
          if (this.state.time < 1) {
            clearInterval(id)
          }else {
            this.setState({time: this.state.time-=1})
          }
        }, 1000);
      }
      });
    }
  }

  handleNewWords = (snapshot) => {
    this.setState({words: snapshot.val()});
    const scoreBoard = {}
    snapshot.val() && Object.keys(snapshot.val()).forEach((entry) => {
      const word = snapshot.val()[entry]
      if (!scoreBoard[word.playerName]) {
        scoreBoard[word.playerName] = 1;
      } else {
        scoreBoard[word.playerName]++;
      }
      if(scoreBoard[word.playerName] > this.state.leader.score) {
        this.setState({scoreBoard, leader: {name: word.playerName, score: scoreBoard[word.playerName]}})
      }
    })
      this.setState({scoreBoard})
  }

  handleChange = (event) => {
    let newInput = event.target.value;
    this.setState({input: newInput});
  }

  // update game
  handleSave = () => {
    if(!this.state.words && this.checkEntry(this.state.input)) {
      this.wordRef.push({
        wordContent: this.state.input,
        playerName: this.state.name,
        points: 1
      });
    } else {
      this.wordRef.orderByChild("wordContent").equalTo(this.state.input).on("value", (snapshot) => {
      if (!snapshot.val() && this.checkEntry(this.state.input)) {
        this.wordRef.push({
          wordContent: this.state.input,
          playerName: this.state.name,
          points: 1
        });
      }
    })
    }
    this.setState({input: ""});
  }

  render () {
    const { words, time, input, letters, scoreBoard, name, leader } = this.state;
    return (
      <div className="App">
        <GameDisplay
          words={words}
          time={time}
          input={input}
          letters={letters}
          scoreBoard={scoreBoard}
          name={name}
          handleChange={this.handleChange}
          handleSave={this.handleSave}
          admin={false}
          leader={leader}
          />
      </div>
    );
  }
}

export default App;
