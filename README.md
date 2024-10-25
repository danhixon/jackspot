# jackspot 🍯
Audio Hijack + Spotify
---
## About

This script is built to run within Audio Hijack 4.4.4, a Mac OS application which allows the system to capture audio.

This script also utilizes a command line utility called [SpotifyControl](https://github.com/whiteemikee/SpotifyControl) to operate Spotify and gather track information. It is also able to identify when ads are playing so that Audio Hijack can "take alternative actions" until they are done.

You can do something you might like to do when the two applications are used together. Capiche?

---
## Setup and Usage
### 1. SpotifyControl
1. Get and install the `SpotifyControl` command line tool from here: [SpotifyControl](https://github.com/whiteemikee/SpotifyControl).

### 2. Spotify
1. Open the Spotify desktop application.
2. Recommended: change the settings to disable "Autoplay" and disable the "Crossfade songs" option.
3. Clear the queue completely.
4. Find the album you like and add it to the queue.
5. Click play on the first track in your queue, then pause it (Don't worry about adjusting the playhead, the script will do it for you).

### 3. Audio Hijack
1. Open Audio Hijack and create a new Session called "Spotify".
2. The Session should have these blocks: an Application source block (Spotify), a Recorder block, and an output block (optional).

![Screenshot 2024-10-25 at 7 23 31 AM](https://github.com/user-attachments/assets/fbb1d4d9-ad6b-4376-938d-dd4f5e9e4dac)

5. Set the parameters of the Application and Recorder blocks as desired. The filename and tags will be set automatically by the script per track.

![Screenshot 2024-10-25 at 7 24 57 AM](https://github.com/user-attachments/assets/5b5e40ac-380a-47cb-b7d5-75b1419ffdf7)

![Screenshot 2024-10-25 at 7 27 18 AM](https://github.com/user-attachments/assets/ca1e8a4f-3551-4f55-8a50-7c85886f41c3)

_You might want to add the album artwork to the Recorder Tags now. The artwork can be added later, but it is easier to do it now so it is automatically applied to all recorded tracks for the current session._

7. Open the Script Library in Audio Hijack ("Window -> Script Library" or `cmd-L`).
8. Click "User Scripts" at the top of the left pane, Press the "New Script" button at the bottom of the pane.
9. Name the script whatever you like, e.g., "Spotify Controller", and paste the `SpotifyController.js` script into the text area.
10. Click the "Run Script Now" button just below the sript source to start the magic.
  - _Note: This will execute in the main thread of Audio Hijack, which will cause the app to be totatlly unresponsive until the capture is complete, i.e., when the album is finished._
  - _If you need to quit the capture, you can force quit the application using the "Force Quit Applications" manager (`cmd+opt+ESC`)._

---

Leave your feedback here if you uncover any bugs or issues. Thanks!
