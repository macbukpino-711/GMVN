window.resizeTo(200, 650);

const image = document.getElementById("musicImage");
const title = document.getElementById("musicTitle");
const nextTitle = document.getElementById("nextTitle");
const artist = document.getElementById("musicArtist");

const play = document.getElementById("playBtn");
const pause = document.getElementById("pauseBtn");
const control = document.getElementById("controlBtn");
const next = document.getElementById("next");
const back = document.getElementById("back");

const musicBar = document.getElementById("musicBar");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");

let isDragging = false;
let audio = new Audio();

let songs = [];
let currentIndex = 0;

function loadSong(index) {
    const currentSong = songs[index];

    image.src = currentSong.img;
    artist.textContent = currentSong.artist;
    audio.src = currentSong.audio;
    
    musicBar.value = 0;
    currentTime.textContent = formatTime(0);
}

let effectTimeout;

function changeSongEffect(index) {
    const currentSong = songs[index];

    if (effectTimeout) {
        clearTimeout(effectTimeout);
    }

    nextTitle.textContent = currentSong.title;

    void title.offsetWidth;
    void nextTitle.offsetWidth;

    title.classList.add("fade-out");
    nextTitle.classList.add("fade-in");

    loadSong(index);
    audio.play();
    control.classList.add("is-playing");
    image.classList.add("spinning");

    effectTimeout = setTimeout(() => {
        title.textContent = currentSong.title;
        title.classList.remove("fade-out");
        nextTitle.classList.remove("fade-in");
        effectTimeout = null;
    }, 400);
}


fetch("song.json")
    .then(data => data.json())
    .then (data => {

        songs = data;
        loadSong(currentIndex);
        
        play.addEventListener("click", () => {
            audio.play();
            control.classList.add("is-playing");
            image.classList.add("spinning");
        });

        pause.addEventListener("click", () => {
            audio.pause();
            control.classList.remove("is-playing");
            image.classList.remove("spinning");
        });
    })
    .catch(e => {
        console.error("ERROR!!!", e);
    });

audio.addEventListener("loadedmetadata", () => {
    musicBar.max = Math.floor(audio.duration);
    duration.textContent = formatTime(audio.duration);
    PaintProgress();
});

audio.addEventListener("timeupdate", () => {
    if (!isDragging) {
        musicBar.value = audio.currentTime;
        currentTime.textContent = formatTime(Math.floor(audio.currentTime));
        PaintProgress();
    }
}); 

musicBar.addEventListener("mousedown", () => {
    isDragging = true;
}); 

musicBar.addEventListener("input", () => {
    currentTime.textContent = formatTime(musicBar.value);
    PaintProgress();
});

musicBar.addEventListener("change", () => {
    audio.currentTime = musicBar.value;
    isDragging = false;
});

function formatTime(sec) {
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);

    if (seconds < 10) seconds = `0${seconds}`;
    if (minutes < 10) minutes = `0${minutes}`;

    return `${minutes}:${seconds}`;
}

function PaintProgress() {
    const max = musicBar.max;
    const value = musicBar.value;

    const percent = (value/max) * 100;

    musicBar.style.background = `linear-gradient(to right, rgb(255, 255, 255) ${percent}%, rgba(182, 182, 182, 0.15) ${percent}%)`;
}

audio.addEventListener("ended", () => {
    currentIndex++;

    if (currentIndex == songs.length) {
        currentIndex = 0;
    }

    changeSongEffect(currentIndex);

    musicBar.value = 0;
    currentTime.textContent = formatTime(0);
    musicBar.style.background = `rgb(182, 182, 182)`;
    
});

next.addEventListener("click", () => {
    currentIndex++;

    if (currentIndex >= songs.length) {
        currentIndex = 0;
    }

    changeSongEffect(currentIndex);

});

back.addEventListener("click", () => {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }

    changeSongEffect(currentIndex);

});





