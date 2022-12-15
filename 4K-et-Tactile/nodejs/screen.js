const socket = io();

const videoMetrage = document.getElementById("videoMetrage");
const videoLoop = document.getElementById("videoLoop");
const videoChoixA = document.getElementById("videoChoixA");
const videoChoixB = document.getElementById("videoChoixB");

const divMetrage = document.getElementById("divMetrage");
const divLoop = document.getElementById("divLoop");
const divChoixA = document.getElementById("divChoixA"); // divdefault
const divChoixB = document.getElementById("divChoixB"); // divactive
const home = document.getElementById("home");

const toggleDisplay = (div, display) => {
  console.info(`Toggle display : ${div.id} | display: ${display}`);
  if (div) {
    div.style.display = display;
  }
};

let currentLoop = false;
let phoneShown = false;

videoMetrage.onended = (e) => {
  toggleDisplay(divMetrage, "none");
  toggleDisplay(divLoop, "block");
  videoLoop.load();
  videoLoop.play();
};

videoMetrage.ontimeupdate = (e) => {
  let currentSecond = parseInt(e.target.currentTime);
  let metrageDuration = parseInt(e.target.duration);
  if (!phoneShown && currentSecond > metrageDuration - 1) {
    socket.emit("GeneralSocket", "showPhone");
    //console.log('send show phone')
    //console.trace();
    currentLoop = false;
    phoneShown = true;
    //console.log('END HANDLER METRAGE')
  }
};

videoChoixA.onended = (e) => {
  socket.emit("GeneralSocket", "end-choice-a");
  toggleDisplay(divChoixA, "none");
  currentLoop = false;
  //console.log('END HANDLER DEFAULT')
};

videoChoixB.onended = (e) => {
  socket.emit("GeneralSocket", "end-choice-b");
  toggleDisplay(divChoixB, "none");
  currentLoop = false;
  //console.log('END HANDLER ACTIVE')
};

// fonction "avance rapide" pour les tests
document.body.onclick = (e) => {
  videoMetrage.currentTime += 30;
};

socket.on("GeneralSocket", function (msg) {
  if (msg === "reset") {
    videoMetrage.pause();
    videoMetrage.currentTime = 0;

    videoLoop.pause();
    videoLoop.currentTime = 0;

    videoChoixA.pause();
    videoChoixA.currentTime = 0;

    videoChoixB.pause();
    videoChoixB.currentTime = 0;

    toggleDisplay(home, "block");
    toggleDisplay(divMetrage, "none");
    toggleDisplay(divLoop, "none");
    toggleDisplay(divChoixB, "none");
    toggleDisplay(divChoixA, "none");

    currentLoop = false;

    phoneShown = false;
  }

  if (
    currentLoop === false &&
    (msg === "start" ||
      msg === "choice-a" ||
      msg === "choice-b" ||
      msg === "results")
  ) {
    //console.log('loop Socket ' + msg + ' ' + currentLoop)
    currentLoop = true;

    if (msg === "start") {
      //console.log('if msg start')

      toggleDisplay(home, "none");
      toggleDisplay(divMetrage, "block");
      videoMetrage.load();
      videoMetrage.play();
    } else if (msg === "choice-a") {
      //console.log('loop default choice')

      toggleDisplay(home, "none");
      toggleDisplay(divMetrage, "none");
      toggleDisplay(divLoop, "none");
      toggleDisplay(divChoixA, "block");

      videoLoop.pause();

      videoChoixA.load();
      videoChoixA.play();
    } else if (msg === "choice-b") {
      //console.log('loop active choice')

      toggleDisplay(home, "none");
      toggleDisplay(divMetrage, "none");
      toggleDisplay(divLoop, "none");
      toggleDisplay(divChoixB, "block");

      videoLoop.pause();

      videoChoixB.load();
      videoChoixB.play();
    } else if (msg === "results") {
      document.querySelectorAll("body > div").forEach((div) => {
        div.style.display = "none";
      });
      var results = { default: 0, active: 0 };
      fetch("log")
        .then((resp) => {
          return resp.text();
        })
        .then((text) => {
          text.split("\n").forEach((log) => {
            Object.keys(results).forEach((res) => {
              if (log.trim().endsWith(res + "choice")) results[res]++;
            });
          });
          Object.keys(results).forEach((res) => {
            document.getElementById("nb" + res).innerText = results[res];
          });
          return Promise.resolve();
        });
    }
  } else {
    //console.log('loop Socket ' + msg + ' ' + currentLoop)
  }
});
