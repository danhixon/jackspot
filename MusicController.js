// Built with Audio Hijack 4.5.3

let FALLBACK_TRACK_COUNT = 0; // Don't over think it, it's the number of the last track

function _throw(m) { throw m; }

function sleep(seconds) {
  console.log('sleeping: ' + seconds);
  return app.runShellCommand('sleep ' + seconds);
}

function getTrackProperty(property_name) {
  const result = app.runShellCommand(
    `osascript -e 'tell application "Music" to get ${property_name} of current track'`
  );
  return result[1].trim();
}

function getPlaylistProperty(property_name) {
  const result = app.runShellCommand(
    `osascript -e 'tell application "Music" to get ${property_name} of current playlist'`
  );
  return result[1].trim();
}

function getTrackInfo() {
  return {
    artist: getTrackProperty('artist'),
    title: getTrackProperty('name'),
    album: getTrackProperty('album'),
    duration: parseInt(getTrackProperty('duration'), 10) // numeric
  };
}

function updateTags(recorder, trackInfo) {
  let copy = Object.assign({}, trackInfo);
  delete copy.duration; // don’t try to tag with duration
  recorder.updateTags(copy);
}

function sleepUntilNextTrack(trackInfo) {
  let checks = 0;
  while (trackInfo.title === getTrackInfo().title) {
    sleep(0.01);
    if (checks > 10000) {
      return;
    }
    checks++;
  }
}

// FIX: this function needs to return a boolean!
function onPlaylist() {
  const count = getPlaylistProperty("count of tracks");
  // returns 0 when not on a playlist
  return count > 0
}

function getTrackCount() {
  if (onPlaylist()) {
    const count = getPlaylistProperty("count of tracks");
    return parseInt(count);
  } else {
    const count = getTrackProperty("track count");
    return parseInt(count);
  }
}

// FIX: typo, was calling a non-existent function getPlaylistTrackCount()
function captureLabel() {
  return onPlaylist() ? getPlaylistProperty("name") : getTrackProperty('album');
}

function main() {
  let session = app.sessionWithName('Music');
  let recorder = session.blockWithName('Recorder');
  let previous = null;

  // ensure volume is up
  app.runShellCommand(`osascript -e 'tell application "Music" to set sound volume to 100'`);

  // reset playhead
  app.runShellCommand(`osascript -e 'tell application "Music" to set player position to 0'`);

  let trackCount = getTrackCount();
  if (trackCount == 0 && FALLBACK_TRACK_COUNT > 0) { trackCount = FALLBACK_TRACK_COUNT; }

  if (trackCount == 0 && FALLBACK_TRACK_COUNT==0) {
    console.dialog(`Track count meta data not set for ${captureLabel()}.\n Set the number of tracks at the top of the script.`);
  } else {  
    console.dialog(`Capturing ${trackCount} tracks from ${captureLabel()}.\n Is your album art in place?\n Fill playback gaps with silence set?\n On Track 1?`);
  }
  
  for (let i = 1; i <= trackCount; i++) {
    let trackInfo = getTrackInfo();
    console.log(trackInfo);

    if (!trackInfo || !trackInfo.title) {
      _throw("Unable to obtain track info.");
    }

    if (previous === null || trackInfo.title !== previous.title) {
      // track has changed -- start a new recording
      recorder.fileName = i.toString().padStart(2, '0') + "-%tag_title";
      trackInfo.track = i;
      updateTags(recorder, trackInfo);

      session.start();
      app.runShellCommand(`osascript -e 'tell application "Music" to play'`);

      console.log(`sleeping for ${trackInfo.duration} seconds`);
      sleep(trackInfo.duration);
      session.stop();

      if (i < trackCount) {
        // wait for track change
        sleepUntilNextTrack(trackInfo);
        // pause and reset to 0 before next track
        app.runShellCommand(`osascript -e 'tell application "Music" to pause'`);
        app.runShellCommand(`osascript -e 'tell application "Music" to set player position to 0'`);
        sleep(0.1); // let commands settle
      }
    }
    previous = Object.assign({}, trackInfo);
  }
}

main();
