window.resizeTo(200, 650);

const image = document.getElementById("musicImage");
const nextImage = document.getElementById("nextMusicImage");
const title = document.getElementById("musicTitle");
const nextTitle = document.getElementById("nextTitle");
const artist = document.getElementById("musicArtist");
const imgContainer = document.getElementById("imgContainer");

const play = document.getElementById("playBtn");
const pause = document.getElementById("pauseBtn");
const control = document.getElementById("controlBtn");
const next = document.getElementById("next");
const back = document.getElementById("back");
const repeat = document.getElementById("repeatBtn");

const musicBar = document.getElementById("musicBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");



let isDragging = false;
let currentIndex = 0;
let songs = [];
let audio = new Audio();

function loadSong(index) {
    const currentSong = songs[index];

    // image.src = currentSong.img;
    artist.textContent = currentSong.artist;
    audio.src = currentSong.audio;
}

let effectTimeout;

function changeSongEffect(index) {
    const currentSong = songs[index];

    if (effectTimeout) {
        clearTimeout(effectTimeout);
    }

    nextTitle.textContent = currentSong.title;
    title.classList.add("fade-out");
    nextTitle.classList.add("fade-in");

    nextImage.src = currentSong.img;
    image.classList.add("fade-out");
    nextImage.classList.add("fade-in");

    loadSong(currentIndex);
    audio.play();
    imgContainer.classList.add("spinning");
    control.classList.add("is-playing");

    effectTimeout = setTimeout(() => {
        title.textContent = currentSong.title;
        title.classList.remove("fade-out");
        nextTitle.classList.remove("fade-in");

        image.src = currentSong.img;
        image.classList.remove("fade-out");
        nextImage.classList.remove("fade-in");
        effectTimeout = null;
    }, 400);
}

fetch("song.json")
    .then(data => data.json())
    .then (data => {
        songs = data;
        loadSong(currentIndex);
    })
    .catch(e => {
        console.error("ERROR!!!", e);
});

play.addEventListener("click", () => {
    audio.play();
    imgContainer.classList.add("spinning");
    control.classList.add("is-playing");
});

pause.addEventListener("click", () => {
    audio.pause();
    imgContainer.classList.remove("spinning");
    control.classList.remove("is-playing");
});

function nextSong() {
    currentIndex++;

    if (currentIndex > songs.length - 1) {
        currentIndex = 0;
    }

    changeSongEffect(currentIndex);
}

next.addEventListener("click", nextSong);

back.addEventListener("click", () => {
   currentIndex--;

   if (currentIndex < 0) {
        currentIndex = songs.length - 1;
   }

   changeSongEffect(currentIndex);
});

audio.addEventListener("loadedmetadata", () => {
    musicBar.max = Math.floor(audio.duration);
    duration.textContent = formatTime(audio.duration);
    PaintProgress();
});

audio.addEventListener("timeupdate", () => {
    if (!isDragging) {
        currentTime.textContent = formatTime(audio.currentTime);
        musicBar.value = Math.floor(audio.currentTime);
    }
    PaintProgress();
});

musicBar.addEventListener("input", () => {
    isDragging = true;
    currentTime.textContent = formatTime(musicBar.value);
    PaintProgress();
});

musicBar.addEventListener("change", () => {
    audio.currentTime = Math.floor(musicBar.value);
    isDragging = false;
    PaintProgress();
}); 

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    return `${minutes}:${seconds}`;
}

function PaintProgress() {
    let value = musicBar.value;
    let max = musicBar.max;
    let percent = (value/max) * 100;

    musicBar.style.background = `linear-gradient(to right, rgb(255, 255, 255) ${percent}%, rgba(182, 182, 182, 0.15) ${percent}%)`;
}

audio.addEventListener("ended", nextSong);

repeat.addEventListener("click", () => {
    audio.loop = !audio.loop;

    repeat.classList.toggle("active", audio.loop);
    next.classList.toggle("active", audio.loop);
    back.classList.toggle("active", audio.loop);

    next.disabled = audio.loop ? true : false;
    back.disabled = audio.loop ? true : false;
});















