import React from 'react';
import './App.css';
import firebase from "firebase/app";
import { GameDisplay } from "./GameDisplay";


class AdminApp extends React.Component {
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

  gameRef = firebase.database().ref().child('games');
  wordRef = firebase.database().ref().child('words');
  playerRef = firebase.database().ref().child('players');


  componentDidMount() {
    const addGameRef = this.gameRef.push();
    addGameRef.set({
      name: "test1",
      gameStart: false,
      letters: ["","","","","","","","","",]
    }).then(() => {
      this.setState({gameID: addGameRef.key});
    })
    this.wordRef.on('value', this.handleNewWords);
    this.gameRef.on('value', this.handleGame);
    this.playerRef.on('value', this.handlePlayer);
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevState.gameID && this.state.gameID) {
      this.generateRandomLetter()
      this.wordRef = firebase.database().ref().child('words').child(this.state.gameID);
      this.gameRef = firebase.database().ref().child('games').child(this.state.gameID);
      this.playerRef.child(this.state.gameID).push().set({
        name: `player ${this.state.players +=1 }`})
      }
    }

  generateRandomLetter = () => {
    let vowels = ["a", "e", "i", "o", "u"];
    let consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "w", "x", "y", "z"];
    const random = (arr) => Math.floor(Math.random() * arr.length);
    let randomLetters = []
    for(let i = 0; i < 2; i++) {
      const newVowel = vowels[random(vowels)];
      randomLetters = randomLetters.concat([newVowel])
      vowels.splice(vowels.indexOf(newVowel),1)
    }
    for(let i = 0; i < 2; i++) {
      const newConsonant = consonants[random(consonants)];
      randomLetters = randomLetters.concat([newConsonant])
      consonants.splice(consonants.indexOf(newConsonant),1)
    }
    let full = vowels.concat(consonants)
    for(let i = 0; i < 5; i++) {
      const newLetter = full[random(full)];
      randomLetters = randomLetters.concat([newLetter])
      full.splice(full.indexOf(newLetter),1)
    }
    this.gameRef.child(this.state.gameID).update({letters: randomLetters})
    this.setState({letters: randomLetters});
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
      const playerCount = Object.keys(snapshot.val()[this.state.gameID]).length
      this.setState({players: playerCount, name:`player ${playerCount}`})
    }
  }

  handleGame = (snapshot) => {
    if (this.state.gameID) {
      this.setState({gameStart: snapshot.val()[this.state.gameID].gameStart, letters: snapshot.val()[this.state.gameID].letters}, () => {
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
    this.setState({words: snapshot.val()[this.state.gameID]});
    const scoreBoard = {}
    snapshot.val()[this.state.gameID] && Object.keys(snapshot.val()[this.state.gameID]).forEach((entry) => {
      const word = snapshot.val()[this.state.gameID][entry]
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

  startGame = () => {
    this.gameRef.update({gameStart: true})
  }

  render () {
    const { words, time, input, letters, scoreBoard, name, gameID, startGame, leader } = this.state;
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
          gameID={gameID}
          startGame={this.startGame}
          admin={true}
          leader={leader}
          />
      </div>
    );
  }
}

export default AdminApp;
