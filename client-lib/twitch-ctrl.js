module.exports = {
  init: init,
  play: play,
  pause: pause,
  mute: mute,
  unmute: unmute,
  setVolume: setVolume,
  getVolume: getVolume,
  getTime: getTime,
  setTime: setTime,
  getDuration: getDuration
};

function init(opts) {
  window.player = new Twitch.Player("video", {
    channel: "panky"
  });

  window.player.addEventListener('error', opts.onError);
  window.player.addEventListener('canplay', opts.onReady);
  window.player.addEventListener('playing', opts.onStateChange);

}

function play() {
  window.player.play();
}

function pause() {
  window.player.pause();
}

function mute() {
  window.player.setMuted(true);
}

function unmute() {
  window.player.setMuted(false);
}

// v:int
function setVolume(v) {
  window.player.setVolume(v);
}

function getVolume() {
  return window.player.getVolume();
}

function getTime() {
  return 10;
  return window.player.getCurrentTime();
}

function setTime(seconds) {
  return false;
}

function getDuration() {
  return 400;
  return window.player.getDuration();
}
