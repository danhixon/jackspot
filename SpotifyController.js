// Built for Audio Hijack 4.4.4
// Depends on the SpotifyControl script here (https://github.com/whiteemikee/SpotifyControl) forked from dronir's script found here (https://github.com/dronir/SpotifyControl)

function _throw(m) { throw m; }

function extractValue(label, text) {
	const regex = new RegExp(`${label}:\\s*(.+)`);
	const match = text.match(regex);
	return match ? match[1].trim() : null;
}

function updateTags(recorder, trackInfoString) {
	recorder.updateTags({
		artist: extractValue('Artist', trackInfoString),
		title: extractValue('Track', trackInfoString),
		album: extractValue('Album', trackInfoString),
		comment: extractValue('Artwork', trackInfoString),
	});
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


let result = app.runShellCommand('spotify info');
let trackInfo = null;
result[0] == 0 ? 	trackInfo = result[1] : _throw("Unable to get track info.");

let session = app.sessionWithName('Spotify');
let recorder = session.blockWithName('Recorder');
recorder.fileName = "%tag_artist-%tag_album-%tag_title";
updateTags(recorder, trackInfo);

startCapture();

// TODO: add looping for multiple tracks
