const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const fs = require("fs");
const path = require("path");
const { clearTimeout } = require("timers");

// HTML pages
["/phone", "/screen", "/console"].forEach((filepath) =>
  app.get(filepath, (_, res) => {
    res.sendFile(__dirname + filepath + ".html");
  })
);

// Resources : images, js, json
[
  "/manifest.json",
  "/home.png",
  "/icone.png",
  "/sw.js",
  "/screen.js",
  "/sw-reg.js",
  "/scenario1.png",
  "/scenario2.png",
  "/make-your-choice.png",
  "/end25sec_final.gif",
  "/end30sec.gif",
].forEach((filepath) =>
  app.get(filepath, (_, res) => {
    res.sendFile(__dirname + filepath);
  })
);

// Videos
["/final_A.mp4", "/final_B.mp4", "/metrage.mp4", "/loop.mp4"].forEach(
  (filepath) =>
    app.get(filepath, (_, res) => {
      res.sendFile(__dirname + "/video" + filepath);
    })
);

// Logger to save choices made by user (ie not in database)
// TODO : save en database ? Ou au moins au format CSV !
const logPath = "../../log.txt";
app.get("/log", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/" + logPath));
});
var logger = fs.createWriteStream(logPath, {
  flags: "a", //'a' means appending (old data will be preserved)
});
function currentDate() {
  return new Date().toLocaleString("fr-FR");
}

var startTimeout = null;
var resetTimeout = null;
var standupTimeout = null;

io.on("connection", (socket) => {
  socket.on("GeneralSocket", (msg) => {
    io.emit("GeneralSocket", msg); // why ???

    // TODO : to refacto.
    if (msg == "readytostart") {
      if (!startTimeout)
        startTimeout = setTimeout(() => {
          io.emit("GeneralSocket", "start");
          startTimeout = null;
        }, process.env.TEST_TIMEOUT || 15000);
    } else if (msg == "choice-a" || msg == "choice-b") {
      logger.write(currentDate() + "\t" + msg + "\n");
    } else if (msg == "standup") {
      // si pas de timeout de reset en cours (si la personne se lève pendant le gif de fin par exemple
      if (!resetTimeout && !standupTimeout)
        standupTimeout = setTimeout(() => {
          io.emit("GeneralSocket", "reset");
          standupTimeout = null;
        }, process.env.TEST_TIMEOUT || 5000);
    } else if (msg == "sitdown") {
      clearTimeout(standupTimeout);
      standupTimeout = null;
    } else if (
      msg == "end-choice-a" ||
      msg == "end-choice-b" ||
      msg == "reset" ||
      msg == "showPhone"
    ) {
      // messages envoyés et exploités directement dans screen.html ou phone.html
    } else console.warn("unhandled msg: " + msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
