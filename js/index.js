(function() {
  'use strict';
  
  // check for SpeechRecognition API
  if (!('webkitSpeechRecognition' in window)) {
    console.log('Speech recognition not supported');
    return false;
  }
  
  var recognition = new webkitSpeechRecognition(),
      recognizing = false,
      ignoreOnEend,
      startTimestamp,
      recognizing,
      finalTranscript;
  
  // required DOM nodes
  var nodes = {
    start: document.querySelector('[data-start]'),
    speech: document.querySelector('[data-speech]'),
    speechInner: document.querySelector('[data-speech] > p'),
    cube: document.querySelector('[data-cube]')
  };
  
  // speech triggers and css classes
  var triggers = {
    'diet pepsi': 'show-left',
    'root beer': 'show-right',
    'sprit': 'show-top',
    'diet coke': 'show-bottom',
    'coke': 'show-front',
    'pepsi': 'show-back',
  };
  
  // initialize speech recognition
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-GB';
  
  // speech recognition started
  recognition.onstart = function() {
    recognizing = true;
    nodes.start.classList.add('active');
    nodes.speech.classList.add('active');
  };
  
  // speech recognition end
  recognition.onend = function(event) {
    recognizing = false;
    nodes.start.classList.remove('active');
    nodes.speech.classList.remove('active');
  };

  // speech recognition result
  recognition.onresult = function(event) {
    
    // show speech recognition results
    nodes.speech.classList.add('active');
    
    // loop through results
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      
      // store transcript and check for match
      var transcript = event.results[i][0].transcript.trim().toLowerCase(),
          match = checkForTrigger(transcript);
      
      // update speech recognition visual
      nodes.speechInner.innerHTML = transcript;
      
      // we have a trigger match
      if(match) {
        
        // allow user to see matched trigger with 500ms delay
        setTimeout(function() {
          
          recognizing = false;
          recognition.stop();
          
          // if cube has classes remove all
          if(nodes.cube.getAttribute('class')) {
            DOMTokenList.prototype.remove.apply(nodes.cube.classList, nodes.cube.getAttribute('class').split(' ')); 
          }
          
          // add matched triggers classes
          DOMTokenList.prototype.add.apply(nodes.cube.classList, match.class.split(' '));
      }, 500);
      }
    }
  };
  
  // speech recognition error
  recognition.onerror = function(event) {
    console.log('Speech Recognition Error');
    console.log(event);
    recognition.stop();
  };
  
  // record btn - start / stop speech recognition
  nodes.start.addEventListener('click', function() {
    if (recognizing) {
      recognition.stop();
      recognizing = false;
      return;
    }
    
    recognition.start();
  });
  
  // speech visual - stop speech recognition
  nodes.speech.addEventListener('click', function() {
    recognition.stop();
  });
  
  // accept speech recognition transcript
  // test for speech recognition trigger match  
  // return object with matched trigger and css classes or false
  function checkForTrigger(check) {
    var cls = '',
        trg = '';
    
    for(var x in triggers) {
      var split = x.split(' ');
      
      split.every(function(s) {
        if(check.indexOf(s) > -1) {
          cls = triggers[x];
          trg = x;
          return false;
        }
        
        return true;
      });
    }
    
    return cls && trg ? {
      class: cls,
      trigger: trg
    } : false;
  }
  
  // instantiate material design modal JS
  $(document).ready(function() {
    $('.modal-trigger').leanModal();
  });
})();