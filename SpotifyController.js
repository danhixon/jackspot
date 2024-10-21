// depends on the SpotifyControl script found here (https://github.com/dronir/SpotifyControl)

function extractValue(label, text) {
	const regex = new RegExp(`${label}:\\s*(.+)`);
	const match = text.match(regex);
	return match ? match[1].trim() : null;
};

function getTrackInfo(trackInfoString) {
	return {
		artist: extractValue('Artist', trackInfoString),
		track: extractValue('Track', trackInfoString),
		album: extractValue('Album', trackInfoString),
		uri: extractValue('URI', trackInfoString),
		duration: extractValue('Duration', trackInfoString),
		position: extractValue('Now at', trackInfoString),
		playerState: extractValue('Player', trackInfoString),
		volume: extractValue('Volume', trackInfoString),
	}
};

function startCapture() {
	// set the playhead back to the beginning of the track
	app.runShellCommand('spotify jump 0');
	// make sure the volume is all the way up
	app.runShellCommand('spotify volume 100');
	const session = app.sessionWithName('Spotify');
	session.start()
	app.runShellCommand('spotify start');
};


let result = app.runShellCommand('spotify info');
let trackInfoString = null;
if (result[0] == 0) {
	trackInfoString = result[1];
}
