/*
 * gameofthings.js
 */
/*jslint    browser : true, continue : true,
  devel : true, indent: 2,  maxerr : 50,
  newcap: true, nomen : true, plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
 */
/* global $ */

var gameofthingsp = (function () {
  'use strict';

	var guessed = $("#guessed-table");
	var players = $("#players-table");
	
	var setQuestionPrompt = (function(){
		$.ajax({
		  type: "GET",
		  url: 'getquestion',
		  success: function (data) {
				console.log('question_post:',data);
				if(data.question == null) {
					setQuestion();
				}
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});		
	})();
	
	var setQuestion = function() {
		var question = prompt("Enter the question");
		if(question != null) {			
			var data = { 'question': question };			
			$.ajax({
			  type: "POST",
				data: data,
			  url: 'setquestion',
			  success: function (data) {
					console.log('question_post:',data);
			  },
				error: function (err) {
					console.log(err);
				},
			  dataType: 'json'
			});
		}				
	};
	
	$("#reader-question-btn").on("click", function() {
		setQuestion();
	});
	
	// initial retrieval of submitted answers
	var getAnswers = (function () {
		$.ajax({
		  type: "GET",
		  url: 'getanswers',
		  success: function (data) {
				console.log('answers:',data);
				var answers_array = data.answers;				
				for( var i = 0; i < answers_array.length; i ++ ) {
				  addAnswer( 
						answers_array[i].username,
						answers_array[i].answer,
						answers_array[i].displayed,
						answers_array[i].guessed
					);
				}
				updateTotals(data.num_answered, data.num_players);
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});
	})();
	
	// retreive message from server that new answer
	// has been submitted
	socket.on('answer_submitted', function(data) {
		addAnswer(data.username, data.answer);
		updateTotals(data.num_answered, data.num_players);
		console.log(data);
	});
	
	// populate the reader page with answers as
	// they are submitted
	var addAnswer = function( username, answer, displayed, guessed ) {
		console.log('adding: ',username,answer)

		var button = $('<button class="btn btn-lg btn-info reader-answer-btn">' + answer + "</button>");
		button.attr("id",username);
		button.bind("click", answerClickedEvent);

		if(displayed) {button.removeClass('btn-info');}
		if(guessed) {button.addClass('reader-btn-guessed');}

		players.append(button);
	}
	
	// shows how many players have submitted answers yet
	var updateTotals = function( num_answered, num_players ) {
		$("#num_answered").text(num_answered);
		$("#num_players").text(num_players);
	};
	
	// style the button according to its state
	// ( guessed or displayed )
	var setBtnStyle = function( btn, displayed, guessed ) {
		if(!displayed) {
			btn.removeClass('btn-info');
			return;
		}
		if(!guessed){
			btn.addClass('reader-btn-guessed');			
		} else {
			btn.removeClass('reader-btn-guessed');
		}
	}
	
	// handle the click of answer button
	var answerClickedEvent = function (e) {
		var username = e.toElement.id;
		$.ajax({
		  type: "GET",
		  url: 'answerclicked/' + username,
		  success: function (data) {
				console.log(data);
				var user_btn = $("#"+username);
				setBtnStyle(user_btn, data.displayed, data.guessed);
		  },
			error: function (err) {
				console.log(err);
			},
		});
	};

	// end this round and tell the server
	// route user back to main page
	$("#next-round").on("click", function(e) {
		if (confirm('Are you sure you want to end this round?')) {
			$.ajax({
			  type: "GET",
			  url: 'nextround',
			  success: function (data) {
					window.location.replace("/");
			  },
				error: function (err) {
					console.log(err);
				},
			});
		} else {
		    // Do nothing!
		}
	});

})();