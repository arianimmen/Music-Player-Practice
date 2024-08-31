// Importing the Storage class from our api (it's just a class inside api.js)
import Storage from "./API.js";

// ------------------- Setting the local values so we can access to them in different mothods -------------------------------------------

let allSongs = Storage.getData(); // Will store all of our songs
let allFilteredSongs = allSongs; // In the programm we filter our songs by favourite, all and search so we will use this variable
let activeSongID = 0; // Id for the active playing song
let activeSongObject; // Store all the informations (in object format) about our active song
let isSongPlaying = 0; // A bool to check if song is playing
let totalTime = 0; // Total time of the song length
let isRepeatOn = 0; // A bool to check if srepeat button is on
let status = "all"; // Status will have 2 possible values: all (all songs) , favorite

const songsCover = document.querySelector(".songs-cover");
const tracksContainer = document.querySelector(".tracks-container");
// *--- selecting the audio tag (it will be act as main audio player) -----
const selectedAudioPlayer = document.querySelector(".selected-audio");

// *------------------------ ModalArea -------------------------------------
// Selecting the modal tags
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
const modalBackImage = document.querySelector(".modal-back-image");

// *-------------------------- audio Controls ------------------------------------
// selecting the play button
const togglePlayPause = document.querySelector(".toggle-play-pause");
const nextBtn = document.querySelector(".nextBtn");
const backBtn = document.querySelector(".backBtn");
const pauseBtn = document.querySelector(".pauseBtn");
const playBtn = document.querySelector(".playbutton");
const repeatBtn = document.querySelector(".repeatBtn");

// *-------------------------- Filtered Controls ---------------------------------
const allBtn = document.querySelector(".allBtn");
const favouriteBtn = document.querySelector(".FavouriteBtn");

// *--------------------------- Favourite ----------------------------------------
const favIconModal = document.querySelector(".favIconModal");

// *--------------------------- SearchBar ---------------------------------------
const searchBar = document.querySelector(".search-bar");
const selectionSection = document.querySelector(".selection");
const titleModal = document.querySelector(
  ".song-playing-section__top__songTitle"
);

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
          // if the heart Icon was clicked by the user
          if (e.target.classList == "tracks__self__right") {
            const favId = e.target.dataset.songid;
            this.favouriteLogic(favId);
          } else {
            // if the track was clicked by the user
            activeSongID = Number(e.target.dataset.songid);
            this.openModalwithActiveSong();
          }
        });
      })
    );
  }

  favouriteLogic(favId) {
    // Finding the song that was clicked to be favorite
    allSongs.forEach((song) => {
      if (song.id == favId) {
        song.isFavourite = Number(!song.isFavourite); // Toggling the favortie status
        allFilteredSongs = allSongs; 
        this.filterSongs(status); // Updating the DOM
      }
    });
    Storage.saveDate(allSongs); // Saving the songs to our local storage 
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
          <h2>${song.title}</h2>
          <p>${song.singer}</p>
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
          <div class="tracks__self__right" data-songId=${song.id}  >
            <svg class="icon tracks__self__right__icon ${
              song.isFavourite == 1 ? "--fav-selected" : ""
            }" data-songId=${song.id}>
              <use xlink:href="./assets/images/sprite.svg#heart" class="tracks__self__right__icon__self"></use>
            </svg>
          </div>
        </div>
    `;
  }

  filterSongs(status) {
    // Filtering the song based on 2 values: Favorite , All
    switch (status) {
      case "favourite":
        const favSongs = allSongs.filter((song) => song.isFavourite === 1); // Filtering the songs that was favorite
        allFilteredSongs = favSongs; // Updating the filteredsongs
        this.addToDOM(allFilteredSongs); // Updating the DOM
        break;

      default:
        allFilteredSongs = allSongs; // Add all songs (Because the default value means the user is on all songs)
        this.addToDOM(allFilteredSongs); // Updating the DOM
        break;
    }

    // Updating the ui like button
    [allBtn, favouriteBtn].forEach((btn) => {
      if (btn.dataset.filterstatus != status) {
        btn.classList.remove("--selected-Filter");
      } else {
        btn.classList.add("--selected-Filter");
      }
    });
  }

  convertTimeForamt(time) {
    // Converting time to a readable format
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
  }

  nextSong() {
    const ui = new Ui();
    let songIndex = allFilteredSongs.findIndex(
      (song) => song.id == activeSongID
    );

    // Checking if we reach our end of songs
    if (songIndex + 1 > allFilteredSongs.length - 1) {
      activeSongID = allFilteredSongs[0].id; // If we reached our end of array, we start from the beginning
    } else {
      songIndex += 1;

      activeSongID = allFilteredSongs[songIndex].id; // Else, go to the next song
    }
    isSongPlaying = 0;
    ui.updateModalWithActiveSong();
  }

  previousSong() {
    const ui = new Ui();

    let songIndex = allFilteredSongs.findIndex(
      (song) => song.id == activeSongID
    );

    // Checking if we reach our end of songs
    if (songIndex - 1 < 0) {
      activeSongID = allFilteredSongs[allFilteredSongs.length - 1].id; // If we reached our end of array, we start from the end
    } else {
      songIndex -= 1;
      activeSongID = allFilteredSongs[songIndex].id;
    }
    isSongPlaying = 0;

    ui.updateModalWithActiveSong();
  }

  updateModalWithActiveSong() {
    this.findSongWithID(activeSongID);

    selectedAudioPlayer.src = activeSongObject.audioSrc;

    // Playing the song
    this.playingAndStopingThesong();

    favIconModal.dataset.idofsong = activeSongID;

    // Updating the ui Modal
    if (activeSongObject.isFavourite) {
      favIconModal.classList.add("--fav-selected");
    } else {
      favIconModal.classList.remove("--fav-selected");
    }
    lyricsSection.innerHTML = activeSongObject.lyrics;
    modalLeftTitle.textContent = activeSongObject.title;
    modalLeftSinger.textContent = activeSongObject.singer;
    modalBackImage.src = activeSongObject.coverModal;
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
        if (isRepeatOn) {
          this.repeat();
        } else {
          this.nextSong();
        }
      }
    });
  }

  repeat() {
    isSongPlaying = 0;
    this.updateModalWithActiveSong();
  }

  repeatBtnLogic() {
    if (isRepeatOn) {
      isRepeatOn = 0;
      isRepeatOn = "";
      repeatBtn.classList.remove("--selected");
    } else {
      isRepeatOn = 1;
      isRepeatOn = "repeat";
      repeatBtn.classList.add("--selected");
    }
  }

  searchLogic(target) {
    if (target == "") {
      allFilteredSongs = allSongs;
      selectionSection.classList.remove("--display-none");
      status = "all";
      this.filterSongs(status);
    } else {
      allFilteredSongs = allSongs.filter((song) =>
        song.title.toLowerCase().includes(target)
      );
      selectionSection.classList.add("--display-none");
      this.addToDOM(allFilteredSongs);
    }
  }

  openModal() {
    document.body.classList.add("disableScroll");
    songPlayingSectionModal.classList.remove("--display-none"); // Opening the modal by removing the class none
  }

  closeModal() {
    songPlayingSectionModal.classList.add("--display-none"); // Closing the modal by adding class none
    document.body.classList.remove("disableScroll");
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

  repeatBtn.addEventListener("click", ui.repeatBtnLogic);

  [allBtn, favouriteBtn].forEach((btn) => {
    btn.addEventListener("click", (e) => {
      status = e.target.dataset.filterstatus;
      ui.filterSongs(status);
    });
  });

  searchBar.addEventListener("input", (e) => {
    let target = e.target.value.trim().toLowerCase();
    ui.searchLogic(target);
  });

  favIconModal.addEventListener("click", (e) => {
    const id = e.target.dataset.idofsong;
    ui.favouriteLogic(id);
    if (e.target.classList.value.includes("--fav-selected")) {
      favIconModal.classList.remove("--fav-selected");
    } else {
      favIconModal.classList.add("--fav-selected");
    }
  });

  ui.progressBar();
});
