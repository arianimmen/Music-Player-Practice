const data = [
  {
    id: 1,
    title: "Bad guy",
    singer: "Harry",
    isFavourite: 0,
    releaseDate: "2024",
    lyrics: "SONG SONG 1 1 1 1 1 1 1 1",
    audioSrc: "./assets/audios/1.mp3",
    coverSrc: "./assets/images/images.jpeg",
  },
  {
    id: 2,
    title: "Good guy",
    singer: "Arian",
    isFavourite: 1,
    releaseDate: "2023",
    lyrics: "SONG SONG 2 2 2 2 2",
    audioSrc: "./assets/audios/2.mp3",
    coverSrc: "./assets/images/cov.png",
  },
  // {
  //   id: 3,
  //   title: "Bad guy",
  //   singer: "Harry",
  //   isFavourite: 0,
  //   releaseDate: "2024",
  //   audioSrc: "./assets/audios/1.mp3",
  //   coverSrc: "./assets/images/images.jpeg",
  // },
  // {
  //   id: 4,
  //   title: "Good guy",
  //   singer: "Arian",
  //   isFavourite: 1,
  //   releaseDate: "2023",
  //   audioSrc: "./assets/audios/1.mp3",
  //   coverSrc: "./assets/images/cov.png",
  // },
];

class Storage {
  static getData() {
    return data;
  }
}

export default Storage;
