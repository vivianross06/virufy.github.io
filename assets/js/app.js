//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; //stream from getUserMedia()
var rec; //Recorder.js object
var input; //MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
  // record only 1 file
  blob_arr = [];
  recordingsList.innerHTML = "";


  console.log("recordButton clicked");

  /*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

  var constraints = { audio: true, video: false };

  /*
    	Disable the record button until we get a success or fail from getUserMedia()
	*/

  recordButton.disabled = true;
  stopButton.disabled = false;
  pauseButton.disabled = false;

  /*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log(
        "getUserMedia() success, stream created, initializing Recorder.js ..."
      );

      /*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
      audioContext = new AudioContext();

      //update the format
      /*  assign to gumStream for later use  */
      gumStream = stream;

      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);

      /*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
      rec = new Recorder(input, { numChannels: 1 });

      //start the recording process
      rec.record();

      console.log("Recording started");
      var counter=11;
      isPaused=false;
      countdown=setInterval(function(){
        if (!isPaused){
          document.getElementById("displayTimer").innerHTML=counter-1;
          console.log(counter);
          counter--
          if (counter==0){
            stopRecording();
            clearInterval(countdown);
          }
        }
      }, 1000);
    })
    .catch(function (err) {
      //enable the record button if getUserMedia() fails
      console.log('Failed')
      console.log(err)
      recordButton.disabled = false;
      stopButton.disabled = true;
      pauseButton.disabled = true;
    });
}

function pauseRecording() {
  isPaused=true;
  console.log("pauseButton clicked rec.recording=", rec.recording);
  if (rec.recording) {
    //pause
    rec.stop();
    pauseButton.innerHTML = "Resume";
  } else {
    //resume
    isPaused=false;
    rec.record();
    pauseButton.innerHTML = "Pause";
  }
}

function stopRecording() {
  clearInterval(countdown);
  console.log("stopButton clicked");
  recordButton.innerHTML = "Retry";

  //disable the stop button, enable the record too allow for new recordings
  stopButton.disabled = true;
  recordButton.disabled = false;
  pauseButton.disabled = true;

  //reset button just in case the recording is stopped while paused
  pauseButton.innerHTML = "Pause";

  //tell the recorder to stop the recording
  rec.stop();

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);
}

const form = document.getElementById("myForm");
const submit_btn = document.getElementById('submit')

let blob_arr = [];

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement("audio");
  var li = document.createElement("li");
  var link = document.createElement("a");

  blob_arr.push(blob)

  //name of .wav file to use during upload and download (without extendion)
  var filename = new Date().toISOString();

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //add the new audio element to li
  li.appendChild(au);

  //add the filename to the li
  li.appendChild(document.createTextNode(filename + ".wav "));

  //add the save to disk link to li
  li.appendChild(link);

  //add the li element to the ol
  recordingsList.appendChild(li);
}

// Access the form element...

form.addEventListener("submit", function (event) {
  event.preventDefault();

  //sendData();
});

// function submit(event) {
//   event.preventDefault();

//   console.log("Form submit", event);
// }
// const submitBtn = document.getElementById("submit");
// submitBtn.onsubmit = submit;

//Count Record

var recordButton = document.getElementById("recordButtonCount");
var stopButton = document.getElementById("stopButtonCount");
var pauseButton = document.getElementById("pauseButtonCount");

//add events to those 2 buttons
recordButtonCount.addEventListener("click", startRecordingCount);
stopButtonCount.addEventListener("click", stopRecordingCount);
pauseButtonCount.addEventListener("click", pauseRecordingCount);

function startRecording() {
  // record only 1 file
  blob_arr_cough = [];
  recordingsList.innerHTML = "";


  console.log("recordButtonCount clicked");

  /*
		Simple constraints object, for more advanced audio features see
		https://addpipe.com/blog/audio-constraints-getusermedia/
	*/

  var constraints = { audio: true, video: false };

  /*
    	Disable the record button until we get a success or fail from getUserMedia()
	*/

  recordButtonCount.disabled = true;
  stopButtonCount.disabled = false;
  pauseButtonCount.disabled = false;

  /*
    	We're using the standard promise based getUserMedia()
    	https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
	*/

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function (stream) {
      console.log(
        "getUserMedia() success, stream created, initializing Recorder.js ..."
      );

      /*
			create an audio context after getUserMedia is called
			sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
			the sampleRate defaults to the one set in your OS for your playback device

		*/
      audioContext = new AudioContext();

      //update the format
      /*  assign to gumStream for later use  */
      gumStream = stream;

      /* use the stream */
      input = audioContext.createMediaStreamSource(stream);

      /*
			Create the Recorder object and configure to record mono sound (1 channel)
			Recording 2 channels  will double the file size
		*/
      rec = new Recorder(input, { numChannels: 1 });

      //start the recording process
      rec.record();

      console.log("Count recording started");
      document.getElementById("recording-now").innerHTML="Recording...";

    .catch(function (err) {
      //enable the record button if getUserMedia() fails
      console.log('Failed')
      console.log(err)
      recordButtonCount.disabled = false;
      stopButtonCount.disabled = true;
      pauseButtonCount.disabled = true;
    });

}

function pauseRecordingCount() {
  isPaused=true;
  console.log("pauseButtonCount clicked rec.recording=", rec.recording);
  document.getElementById("recording-now").innerHTML="Recording paused";
  if (rec.recording) {
    //pause
    rec.stop();
    pauseButton.innerHTML = "Resume";
  } else {
    //resume
    document.getElementById("recording-now").innerHTML="Recording..."
    rec.record();
    pauseButton.innerHTML = "Pause";
  }
}

function stopRecordingCount() {
  console.log("stopButtonCount clicked");
  document.getElementById("recording-now").innerHTML="Recording finished";
  recordButtonCount.innerHTML = "Retry";

  //disable the stop button, enable the record too allow for new recordings
  stopButtonCount.disabled = true;
  recordButtonCount.disabled = false;
  pauseButtonCount.disabled = true;

  //reset button just in case the recording is stopped while paused
  pauseButtonCount.innerHTML = "Pause";

  //tell the recorder to stop the recording
  rec.stop();

  //stop microphone access
  gumStream.getAudioTracks()[0].stop();

  //create the wav blob and pass it on to createDownloadLink
  rec.exportWAV(createDownloadLink);
}

const form = document.getElementById("myForm");
const submit_btn = document.getElementById('submit')

let blob_arr_cough = [];

function createDownloadLink(blob) {
  var url = URL.createObjectURL(blob);
  var au = document.createElement("audio");
  var li = document.createElement("li");
  var link = document.createElement("a");

  blob_arr.push(blob)

  //name of .wav file to use during upload and download (without extendion)
  var filename = new Date().toISOString();

  //add controls to the <audio> element
  au.controls = true;
  au.src = url;

  //add the new audio element to li
  li.appendChild(au);

  //add the filename to the li
  li.appendChild(document.createTextNode(filename + ".wav "));

  //add the save to disk link to li
  li.appendChild(link);

  //add the li element to the ol
  recordingsList.appendChild(li);
}

// Access the form element...

form.addEventListener("submit", function (event) {
  event.preventDefault();

  //sendData();
});
