// Built for Audio Hijack 4.4.4
// Depends on the SpotifyControl script here (https://github.com/whiteemikee/SpotifyControl)
// Forked from dronir's script found here (https://github.com/dronir/SpotifyControl)

function _throw(m) { throw m; }

function sleep(ms) {
  return app.runShellCommand('sleep ' + ms / 1000);
}

function extractValue(label, text) {
  const regex = new RegExp(`${label}:\\s*(.+)`);
  const match = text.match(regex);
  return match ? match[1].trim() : null;
}

function extractDuration_ms(durationStr) {
  const match = durationStr.match(/\((\d+)\s*ms\)/);
  return match ? parseInt(match[1], 10) : null;
}

function getTrackInfo() {
  let result = app.runShellCommand('spotify info');
  if (result[0] != 0) return null;
  return {
    artist: extractValue('Artist', result[1]),
    title: extractValue('Track', result[1]),
    album: extractValue('Album', result[1]),
    // TODO: figure out how to add the artwork itself to the artwork field.
    comment: extractValue('Artwork', result[1]),
    uri: extractValue('URI', result[1]),
    duration: extractDuration_ms(extractValue('Duration', result[1])),
  };
}

function updateTags(recorder, trackInfo) {
  let copy = Object.assign({}, trackInfo);
  delete copy.duration;
  recorder.updateTags(copy);
}

function startCapture(session) {
  // set the playhead back to the beginning of the track
  app.runShellCommand('spotify jump 0');
  // make sure the volume is all the way up
  app.runShellCommand('spotify volume 100');
  session.start()
  app.runShellCommand('spotify start');
}

function stopCapture(session) {
  session.stop();
  app.runShellCommand('spotify stop');
}

function main() {
  const session = app.sessionWithName('Spotify');
  const recorder = session.blockWithName('Recorder');
  let previous = null;
  let i = 1;

  while (true) {
    let trackInfo = getTrackInfo();

    if (trackInfo == null) {
      throw "Unable to obtain track info.";
    } else if (trackInfo.uri.includes(":ad:")) {
      // do not start recording and wait until a track is playing again.
      app.runShellCommand('spotify start');
      sleep(trackInfo.duration);
      app.runShellCommand('spotify stop');
      continue;  // skip the assignment of 'previous'
    } else if (previous != null && trackInfo.album != previous.album) {
      break;
    } else if (previous == null || trackInfo.title != previous.title) {
      // track has changed -- start a new recording
      recorder.fileName = "%tag_artist-%tag_album-" + i.toString().padStart(2, '0') + "-%tag_title";
      trackInfo.track = i;
      updateTags(recorder, trackInfo);
      startCapture(session);
      sleep(trackInfo.duration);
      stopCapture(session);
      i++;
    } else {
      sleep(1000);
    }
    previous = Object.assign({}, trackInfo);
  }
}

main();
