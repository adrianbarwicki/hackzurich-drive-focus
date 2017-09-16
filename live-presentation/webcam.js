(function() {
  // The width and height of the captured photo. We will set the
  // width to the value defined here, but the height will be
  // calculated based on the aspect ratio of the input stream.

  var width = 1066;    // We will scale the photo width to this
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
      
        video.setAttribute('width', 400);
        video.setAttribute('height', 260);
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
      
      var subscriptionKey = '03772567483d4a07aa5da13bae6d21da';
      var uriBase = "https://westeurope.api.cognitive.microsoft.com/vision/v1.0/analyze";
	 
	  /*
	  // Request parameters.
      var params = {
            "visualFeatures": "Categories,Description,Color",
            "details": "",
            "language": "en",
      };
    */
    
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
	        
	        var cList = null;
	        var cList = $('ul.mylist');
			$.each(answer.description.tags, function(i)
			{
			    var li = $('<li/>')
			        .addClass('ui-menu-item')
			        .attr('role', 'menuitem')
			        .appendTo(cList);
			    var aaa = $('<a/>')
			        .addClass('ui-all')
			        .text(answer.description.tags[i])
			        .appendTo(li);
			});
	    }
	}
	        
	       
	        
    
                          	
		/*
        // Perform the REST API call.
        $.ajax({
            // url: uriBase + "?" + $.param(params),
            //url: uriBase,

            // Request headers.
            beforeSend: function(xhrObj){
	           	xhrObj.setRequestHeader("Content-Type","application/octet-stream");
	           	xhrObj.setRequestHeader("Content-Type","multipart/form-data");
                // xhrObj.setRequestHeader("Content-Type","application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",
            cache: false,
            contentType: false,
            processData: false,
            dataType: 'text',

            // Request body.
            // data: makeblob(data),
            data: data,
        })

        .done(function(data) {
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            console.log(data);
        })

        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
            alert(errorString);
        });
        */
        
      
	  // responsiveVoice.speak("Hi there, you seem distracted. Could you put your phone away.");

    } else {
      clearphoto();
    }
  }

  // Set up our event listener to run the startup process
  // once loading is complete.
  window.addEventListener('load', startup, false);
})();