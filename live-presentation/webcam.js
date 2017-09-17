(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 600;    // We will scale the photo width to this
  var height = 0;     // This will be computed based on the input stream

  // |streaming| indicates whether or not we're currently streaming
  // video from the camera. Obviously, we start at false.

  var streaming = false;

  // The various HTML elements we need to configure or control. These
  // will be set by the startup() function.

  var video = null;
  var canvas = null;
  var photo = null;
  var startbutton = null;
  var startbuttonSound = null;

  function startup() {
    video = document.getElementById('video');
    canvas = document.getElementById('canvas');
    photo = document.getElementById('photo');
    startbutton = document.getElementById('startbutton');
	startbuttonSound = document.getElementById('startbuttonSound');
	console.log(startbuttonSound);


    navigator.getMedia = ( navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia ||
                           navigator.msGetUserMedia);

    navigator.getMedia(
      {
        video: true,
        audio: false
      },
      function(stream) {
        if (navigator.mozGetUserMedia) {
          video.mozSrcObject = stream;
        } else {
          var vendorURL = window.URL || window.webkitURL;
          video.src = vendorURL.createObjectURL(stream);
        }
        video.play();
      },
      function(err) {
        console.log("An error occured! " + err);
      }
    );

    video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', 600);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
        
      }
    }, false);
	
	setInterval(function() {
	  // method to be executed;
	  takepicture();
	  console.log('Take a picture.');
	}, 5000);
    
    startbutton.addEventListener('click', function(ev){	 	
    }, false);
        
      	// console.log(startbuttonSound);
	  	// startbuttonSound.addEventListener('click', function(ev){
	    // responsiveVoice.speak("Hi there, you seem distracted. Could you put your phone away.");
  		// }, false);
  
  }


  // Fill the photo with an indication that none has been
  // captured.

  function clearphoto() {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
  }
  
  // Capture a photo by fetching the current contents of the video
  // and drawing it into a canvas, then converting that to a PNG
  // format data URL. By drawing it on an offscreen canvas and then
  // drawing that to the screen, we can change its size and/or apply
  // other changes before drawing it.

  function takepicture() {
    var context = canvas.getContext('2d');
    
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      var data = canvas.toDataURL('image/png');
      photo.setAttribute('src', data);
      	        
    var frame = captureVideoFrame('video', 'png');
    var apiKey = "03772567483d4a07aa5da13bae6d21da";
    var request = new XMLHttpRequest();
    request.open('POST', 'https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Categories,Tags,Description,Faces,Color&language=en', true);
    request.setRequestHeader("Content-Type", "application/octet-stream");
    request.setRequestHeader("Ocp-Apim-Subscription-Key", apiKey);
    request.send(frame.blob);
    
    //triggered when we receive an answer
    request.onreadystatechange = function () {
        if (request.readyState == XMLHttpRequest.DONE) {
	        var answer = JSON.parse(request.responseText);
	        console.log(answer.description.tags);
			
			$('#distracted').html("You're focused! :)");

			var contentJson = "<p>";
			
			$.each(answer.description.tags, function(i)
			{
			    contentJson += highlightengine(answer.description.tags[i]) + ", ";
			    if(answer.description.tags[i] == "drinking" || answer.description.tags[i] == "glass"){
				    console.log("distracted");
					$('#distracted').html("You're distracted! :(");
				  }

			});
			
			contentJson += "</p>";
			console.log(contentJson);
			
			$('#mylist').html(contentJson);
	        	        
		}
	}


    } else {
      clearphoto();
    }
  }
   
  function highlightengine (data) {
	  if(data == "drinking" || data == "glass"){
		  $('#distracted').html("You're distracted! :(");
		  return "<b>" + data + "</b>";  
	  }
	  else{
		  return data;
	  }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);



})();