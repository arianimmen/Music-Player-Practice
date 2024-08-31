const data = [
  {
    id: 1,
    title: "Weatherman",
    singer: "Zach Hood",
    isFavourite: 0,
    lyrics: `The other day <br />
              Your mood was swinging, thought you needed space <br />
              I took a drive and stayed out of the way for you <br />
              But one day turned to three <br />
              Then three into a week <br />
              And I'm starting to think that <br />
              You're somewhere in the middle of the black and the white <br />
              You're growing non-commital, I can see it your eyes <br />
              And I don't know how, and I don't know why <br />
              But my eyes they rain, got a cloudy mind <br />
              Sound the alarm <br />
              The weather man is screaming <br />
              There's a storm <br />
              It's coming, I can feel it <br />
              The trees are barely moving <br />
              And the birds are hardly singing <br />
              The leaves have left the branches <br />
              Now I know you're really leaving <br />
              The other day <br />
              I'll admit that I was out of place <br />
              But I just think you went and blew it way out of proportion <br />
              Lost sight of what's important <br />
              You couldn't find a reason to escape, and so you forced it <br />
              You're somewhere in the middle of the black and the white <br />
              You're growing non-commital, I can see it your eyes <br />
              And I don't know how, and I don't know why <br />
              But my eyes they rain, got a cloudy mind <br />
              Sound the alarm <br />
              The weather man is screaming <br />
              There's a storm <br />
              It's coming, I can feel it <br />
              The trees are barely moving <br />
              And the birds are hardly singing <br />
              The leaves have left the branches <br />
              Now I know you're really leaving <br />
              Sound the alarm <br />
              The weather man is screaming <br />
              There's a storm <br />
              It's coming, I can feel it <br />
              The trees are barely moving <br />
              And the birds are hardly singing <br />
              The leaves have left the branches <br />
              Now I know you're really leaving <br />
              You're really leaving <br />
              You're leaving`,
    audioSrc: "./assets/audios/1.mp3",
    coverSrc: "./assets/images/images.jpeg",
  },
  {
    id: 2,
    title: "2 Good guy",
    singer: "Arian",
    isFavourite: 0,
    releaseDate: "2023",
    lyrics: "SONG SONG 2 2 2 2 2",
    audioSrc: "./assets/audios/2.mp3",
    coverSrc: "./assets/images/cov.png",
  },
  {
    id: 3,
    title: "3 guy",
    singer: "S",
    isFavourite: 0,
    releaseDate: "2021",
    audioSrc: "./assets/audios/3.mp3",
    coverSrc: "./assets/images/images.jpeg",
  },
  {
    id: 4,
    title: "4 Not en..",
    singer: "Arian",
    isFavourite: 0,
    releaseDate: "2025",
    audioSrc: "./assets/audios/4.mp3",
    coverSrc: "./assets/images/cov.png",
  },
];

class Storage {
  static getData() {
    // JSON.parse(localStorage.getItem("songs")) ||
    return data;
  }

  static saveDate(data) {
    localStorage.setItem("songs", JSON.stringify(data));
  }
}

export default Storage;
