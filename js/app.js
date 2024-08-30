import Storage from "./API.js";

let allSongs = Storage.getData();
let activeSongID = 0;
let activeSongObject;
let isSongPlaying = 0;
let totalTime = 0;
let repeatOrRandom = "";
let isRandomOn = 0;
let isRepeatOn = 0;

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

// progress
const progressBarUi = document.querySelector(
  ".song-playing-section__bottom__progress__self"
);

// *-------------------------- audio Controls ------------------------------------
// selecting the play button
const togglePlayPause = document.querySelector(".toggle-play-pause");
const nextBtn = document.querySelector(".nextBtn");
const backBtn = document.querySelector(".backBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const playBtn = document.querySelector(".playbutton");
const randomBtn = document.querySelector(".randomBtn");
const repeatBtn = document.querySelector(".repeatBtn");

// *-------------------------- Filtered Controls ---------------------------------
const allBtn = document.querySelector(".allBtn");
const newsBtn = document.querySelector(".newsBtn");
const favouriteBtn = document.querySelector(".FavouriteBtn");

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

  filterSongs(status) {
    switch (status) {
      case "favourite":
        const favSongs = allSongs.filter((song) => song.isFavourite === 1);
        this.addToDOM(favSongs);
        break;

      case "news":
        const filteredSongs = allSongs.sort((a, b) => {
          new Date(a.releaseDate) > new Date(b.releaseDate) ? 1 : -1;
        });
        this.addToDOM(filteredSongs);

      default:
        this.addToDOM(allSongs);
        break;
    }

    [allBtn, newsBtn, favouriteBtn].forEach((btn) => {
      if (btn.dataset.filterstatus != status) {
        btn.classList.remove("--selected-Filter");
      } else {
        btn.classList.add("--selected-Filter");
      }
    });
  }

  convertTimeForamt(time) {
    function addpad(time) {
      return String(time).padStart(2, "0");
    }

    const convertedTime = `${addpad(Math.floor(time / 60))}:${addpad(
      Math.floor(time % 60)
    )}`;

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

    // Checking if we reach our end of songs
    if (activeSongID + 1 > allSongs.length) {
      activeSongID = 1; // If we reached our end of array, we start from the beginning
    } else {
      activeSongID += 1; // Else, go to the next song
    }
    isSongPlaying = 0;
    ui.updateModalWithActiveSong();
  }

  previousSong() {
    const ui = new Ui();

    // Checking if we reach our end of songs
    if (activeSongID - 1 < 1) {
      activeSongID = allSongs.length; // If we reached our end of array, we start from the end
    } else {
      activeSongID -= 1; // Else, go to the previous song
    }
    isSongPlaying = 0;
    ui.updateModalWithActiveSong();
  }

  updateModalWithActiveSong() {
    this.findSongWithID(activeSongID);
    selectedAudioPlayer.src = activeSongObject.audioSrc;

    // Playing the song
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

  progressBar() {
    selectedAudioPlayer.addEventListener("loadedmetadata", () => {
      totalTime = selectedAudioPlayer.duration;
      const time = this.convertTimeForamt(totalTime);
    });

    selectedAudioPlayer.addEventListener("timeupdate", () => {
      const currentTime = selectedAudioPlayer.currentTime;
      const percent = `${String((currentTime / totalTime) * 100)}%`;
      progressBarUi.style.width = percent;

      if (percent === "100%") {
        switch (repeatOrRandom) {
          case "repeat":
            this.repeat();
            break;

          case "random":
            this.random();

          default:
            this.nextSong();
            break;
        }
      }
    });
  }

  random() {
    function getRandomInt(min, max) {
      const minCeiled = Math.ceil(min);
      const maxFloored = Math.floor(max);
      return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }

    const max = allSongs.length + 1;
    const min = 1;

    activeSongID = getRandomInt(min, max);
    isSongPlaying = 0;
    this.updateModalWithActiveSong();
  }

  randomBtnLogic() {
    if (isRandomOn) {
      isRandomOn = 0;
      repeatOrRandom = "";
      randomBtn.classList.remove("--selected");
    } else {
      isRandomOn = 1;
      isRepeatOn = 0;
      repeatOrRandom = "random";
      randomBtn.classList.add("--selected");
      repeatBtn.classList.remove("--selected");
    }
  }

  repeat() {
    isSongPlaying = 0;
    this.updateModalWithActiveSong();
  }

  repeatBtnLogic() {
    if (isRepeatOn) {
      isRepeatOn = 0;
      repeatOrRandom = "";
      repeatBtn.classList.remove("--selected");
    } else {
      isRepeatOn = 1;
      isRandomOn = 0;
      repeatOrRandom = "repeat";
      repeatBtn.classList.add("--selected");
      randomBtn.classList.remove("--selected");
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

  randomBtn.addEventListener("click", ui.randomBtnLogic);
  repeatBtn.addEventListener("click", ui.repeatBtnLogic);

  [allBtn, newsBtn, favouriteBtn].forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const status = e.target.dataset.filterstatus;
      ui.filterSongs(status);
    });
  });

  ui.progressBar();
});
