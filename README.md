webplayer
=========

Node js webplayer, developed for the raspberry pi.

It is based on the following REST API:

/rest/list/<folder name> - get the content of the folder
/rest/play/<name.mp3>    - play the file
/rest/playAll/<folder>   - play all files in the folder
/rest/stop               - stop playback

By default it uses "mplayer".
