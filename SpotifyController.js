// Built for Audio Hijack 4.4.4
// Depends on the SpotifyControl script here (https://github.com/whiteemikee/SpotifyControl)
// Forked from dronir's script found here (https://github.com/dronir/SpotifyControl)

function _throw(m) { throw m; }

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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
    duration: extractDuration_ms(extractValue('Duration', result[1])),
  };
}

function updateTags(recorder, trackInfo) {
  let copy = Object.assign({}, trackInfo);
  delete copy.duration;
  recorder.updateTags(copy);
}

function startCapture() {
  // set the playhead back to the beginning of the track
  app.runShellCommand('spotify jump 0');
  // make sure the volume is all the way up
  app.runShellCommand('spotify volume 100');
  const session = app.sessionWithName('Spotify');
  session.start()
  app.runShellCommand('spotify start');
}

async function main() {
  let session = app.sessionWithName('Spotify');
  let recorder = session.blockWithName('Recorder');
  let previous = null;

  while (true) {
    let trackInfo = getTrackInfo();

    if (trackInfo == null) {
      throw "Unable to obtain track info.";
    } else if (trackInfo.album == 'Advertisement') {
      // do not start recording and wait until a track is playing again.
    } else if (trackInfo.title != previousTitle) {
      // track has changed -- start a new recording
      recorder.fileName = "%tag_artist-%tag_album-%tag_title";
      updateTags(recorder, trackInfo);
      startCapture();
    } else {
      // sleep for the duration of the current track
      await sleep(trackInfo.duration)
    }
    previous = Object.assign({}, trackInfo);
  }
}

main();
