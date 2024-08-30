const data = [
  {
    id: 1,
    title: "1 Bad guy",
    singer: "Harry",
    isFavourite: 1,
    releaseDate: "2024",
    lyrics: "SONG SONG 1 1 1 1 1 1 1 1",
    audioSrc: "./assets/audios/1.mp3",
    coverSrc: "./assets/images/images.jpeg",
  },
  {
    id: 2,
    title: "2 Good guy",
    singer: "Arian",
    isFavourite: 1,
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
    return data;
  }
}

export default Storage;
