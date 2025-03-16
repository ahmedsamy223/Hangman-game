class Hangman {
  constructor() {
    this.word = "";
    this.guessedLetters = [];
    this.status = "playing";
    this.end = "Hangman".split("");
    this.begin = "";
    this.count = 0;
    this.show = Math.floor(this.word.length / 2);
  }

  async get() {
    try {
      const url = "https://api.api-ninjas.com/v1/randomword";
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-Api-Key": "XdMl6zii92JpPIO8cbR4JQ==3vBWMXx7BJfMr2mE",
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.word[0];
      } else {
        throw new Error("Request failed!");
      }
    } catch (e) {
      console.error(e);
      return null;
    }
  }
  random() {
    return Math.floor(Math.random() * this.word.length);
  }

  hint() {
    for (let i = 0; i < this.show; i++) {
      let r = this.random();
      if (this.guessedLetters.includes(this.word[r])) {
        i--;
      } else {
        this.guessedLetters.push(this.word[r]);
        document.querySelector("#word").innerHTML = "";
        this.start();
        return;
      }
    }
  }

  start() {
    this.word.forEach((letter) => {
      let span = document.createElement("span");
      if (this.guessedLetters.includes(letter) || letter === " ") {
        span.textContent = letter.toLowerCase();
        document.querySelector("#word").appendChild(span);
      } else {
        span.textContent = "*";
        document.querySelector("#word").appendChild(span);
      }
    });
  }

  game() {
    if (this.begin === this.end.join("")) {
      this.status = "failed";
      alert("You have lost the game the word was " + this.word.join(""));
    }
    if (this.word.every((letter) => this.guessedLetters.includes(letter))) {
      this.status = "finished";
      console.log(this.status);
      alert("You have won the game");
    }
  }

  hang() {
    this.begin += this.end[this.count];
    console.log(this.begin);
    this.count++;
  }

  makeGuess(guess) {
    guess = guess.toLowerCase();
    const isUnique = !this.guessedLetters.includes(guess);
    const isBadGuess = !this.word.includes(guess);
    if (isUnique && isBadGuess) {
      this.hang();
    }
    if (isUnique) {
      this.guessedLetters.push(guess);
    }
  }

  async initialize() {
    this.word = await this.get();
    this.word = this.word.toLowerCase().split("");
    this.show = Math.floor(this.word.length / 2);
    console.log(this.word);
    console.log(this.guessedLetters);
    this.start();
    const h2 = document.querySelector("#guess");
    h2.textContent = this.begin;

    window.addEventListener(
      "keypress",
      function (e) {
        if (!this.guessedLetters.includes(e.key)) {
          const guess = String.fromCharCode(e.charCode);
          this.makeGuess(guess);
          document.querySelector("#word").innerHTML = "";
          this.start();
          h2.textContent = this.begin;
          this.game();
        } else {
          e.preventDefault();
        }
      }.bind(this)
    );

    document.querySelector("#hint").addEventListener(
      "click",
      function (e) {
        if (this.status === "playing") {
          this.hint();
        }
        h2.textContent = this.begin;
      }.bind(this)
    );
  }
}
const hangman = new Hangman();
hangman.initialize();
