import Storage from "./API.js";

let allSongs = Storage.getData();
let activeSongID = 0;
let activeSongObject;
let isSongPlaying = 0;

const songsCover = document.querySelector(".songs-cover");
const tracksContainer = document.querySelector(".tracks-container");

// *selecting the audio tag (it will be act as main audio player)
const selectedAudioPlayer = document.querySelector(".selected-audio");

// *------------------------ ModalArea -------------------------------------
// Selecting the modal tag
const songPlayingSectionModal = document.querySelector(".song-playing-section");
const closeBtn = document.querySelector(".close-btn");
const lyricsSection = document.querySelector(
  ".song-playing-section__top__lyric"
);
const modalLeftTitle = document.querySelector(".modalLeftTitle");
const modalLeftSinger = document.querySelector(".modalLeftSinger");

// *------------------- audio Controls ----------------------
// selecting the play button
const togglePlayPause = document.querySelector(".toggle-play-pause");
const nextBtn = document.querySelector(".nextBtn");
const backBtn = document.querySelector(".backBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const playBtn = document.querySelector(".playbutton");

class Ui {
  addToDOM(songs) {
    // Adding the Song Cover into the Dom
    let coverHTMLS = "";
    songs.forEach((song) => {
      coverHTMLS += this.createCoverHTML(song);
    });
    songsCover.innerHTML = coverHTMLS; // Updating the DOM

    // Adding the SOngs playlist into the DOM
    let playlistHTML = "";
    songs.forEach((song) => {
      playlistHTML += this.createPlaylistHTML(song);
    });
    tracksContainer.innerHTML = playlistHTML; // Updating the DOM

    // Adding event listener for playlist and cover :
    const allCoversSongs = document.querySelectorAll(".song-cover__self");
    const allPlaylistSongs = document.querySelectorAll(".tracks__self");

    [allCoversSongs, allPlaylistSongs].forEach((item) =>
      item.forEach((song) => {
        song.addEventListener("click", (e) => {
          activeSongID = Number(e.target.dataset.songid);
          this.openModalwithActiveSong();
        });
      })
    );
  }

  createCoverHTML(song) {
    return `
      <div class="song-cover__self" data-songId = "${song.id}">
        <div class="song-cover__self__cover-image">
          <img src= "${song.coverSrc}" />
          <svg class="icon">
            <use xlink:href="./assets/images/sprite.svg#playbutton"></use>
          </svg>
        </div>
        <div class="song-cover__self__text">
          <h2>"${song.title}"</h2>
          <p>"${song.singer}"</p>
        </div>
      </div>
    `;
  }

  createPlaylistHTML(song) {
    return `
        <div class="tracks__self" data-songId=${song.id}>
          <div class="tracks__self__left">
            <div class="tracks__self__left__play-icon">
              <svg class="icon">
                <use xlink:href="./assets/images/sprite.svg#playbutton"></use>
              </svg>
            </div>
            <div class="tracks__self__left__text">
              <h2>${song.title}</h2>
              <p>${song.singer}</p>
            </div>
          </div>
          <div class="tracks__self__right">
            <svg class="icon tracks__self__right__icon">
              <use xlink:href="./assets/images/sprite.svg#heart"></use>
            </svg>
          </div>
        </div>
    `;
  }

  convertTimeForamt(time) {
    console.log(time);

    const convertedTime = `${Math.floor(time / 60)}: ${Math.floor(time % 60)}`;
    console.log(convertedTime);

    return convertedTime;
  }

  openModalwithActiveSong() {
    this.openModal(); // Opening the Modal
    closeBtn.addEventListener("click", this.closeModal); // if close button was clicked, close the modal!
    this.updateModalWithActiveSong();

    // Audio Controls Logic
  }

  nextSong() {
    const ui = new Ui();
    activeSongID += 1;
    isSongPlaying = 0;
    ui.updateModalWithActiveSong();
  }

  previousSong() {
    const ui = new Ui();
    activeSongID -= 1;
    isSongPlaying = 0;
    ui.updateModalWithActiveSong();
  }

  updateModalWithActiveSong() {
    this.findSongWithID(activeSongID);
    this.playingAndStopingThesong();

    // Updating the ui Modal
    lyricsSection.textContent = activeSongObject.lyrics;
    modalLeftTitle.textContent = activeSongObject.title;
    modalLeftSinger.textContent = activeSongObject.singer;
  }

  findSongWithID(id) {
    const [foundedSong] = allSongs.filter((song) => song.id === id);
    activeSongObject = { ...foundedSong };
  }

  playingAndStopingThesong() {
    selectedAudioPlayer.src = activeSongObject.audioSrc;

    // checking if the song is playing or not
    if (!isSongPlaying) {
      selectedAudioPlayer.play();
      pauseBtn.classList.remove("--display-none");
      playBtn.classList.add("--display-none");

      isSongPlaying = 1; // Changing the playing status
    } else {
      selectedAudioPlayer.pause();
      isSongPlaying = 0;
      playBtn.classList.remove("--display-none");
      pauseBtn.classList.add("--display-none");
    }
  }

  openModal() {
    songPlayingSectionModal.classList.remove("--display-none"); // Opening the modal by removing the class none
  }

  closeModal() {
    songPlayingSectionModal.classList.add("--display-none"); // Closing the modal by adding class none

    selectedAudioPlayer.src = activeSongObject.audioSrc;
    selectedAudioPlayer.pause();
    selectedAudioPlayer.currentTime = 0;
    isSongPlaying = 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new Ui();
  ui.addToDOM(allSongs);
  togglePlayPause.addEventListener("click", ui.playingAndStopingThesong);
  nextBtn.addEventListener("click", ui.nextSong);
  backBtn.addEventListener("click", ui.previousSong);
});
