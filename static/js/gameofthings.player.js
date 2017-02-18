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

	var submit = $("#player-submit");
	var user_button = $("#user-button");
	var user = $("#username").text();
	var answer = $("#answer");

	answer.focus();
	
	// make sure we are registered and ready to play!
	var checklogin = (function() {
		$.ajax({
		  type: "GET",
		  url: 'checklogin',
		  success: function (data) {
				console.log('results',data);
				$("#username").text(data.username); // set the name
				$("#user-button-label").text(""); // clear the help text
				$("#submitted-answer").text(data.answer); // set the submitted answer
		  },
			error: function (err) {
				console.log(err);
				user_button.focus();
			},
		});
	})();
	
	// when you trigger a new round, clear last round's answer
	socket.on('clear_answers', function(data) {
		$("#submitted-answer").text("");
		$("#submitted-answer-key").text("Answer:");
	});
	
	// set the name and register with the server
	user_button.on("click", function(e) {
		
		if( $("#username").text() != "" ) { return; }
		var username = prompt('Enter your name?');
		if( username != null ) {			
			username = username.replace(" ", "_");
			var pdata = {
				"username": username
			}			
			$.ajax({
			  type: "POST",
			  url: 'adduser',
			  data: pdata,
			  success: function (data) {
					console.log('success',data);
					$("#user-button-label").text("");
					$("#username").text(data.username);
					answer.focus();
			  },
				error: function (err) {
					console.log('err',err);
				},
			  dataType: 'json'
			});
		}
	});
	
	// submit the answer to server
	submit.on("click", function(e) {
		e.preventDefault();		
		var answer_str = $("#answer").val();
		
		if( answer_str.replace(/\s+/, "").length > 0 ) {
			console.log("submitting");
			var data = {
				'answer':answer_str,	
				'username':$("#username").text().replace(" ", "_")
			};
		
			console.log(data);
			$.ajax({
			  type: "POST",
			  url: 'submitAnswer',
			  data: data,
				success: function(data) {
					console.log('success',data);
					$("#submitted-answer").text(answer_str); // set answer text
					answer.val("");
					if( data.is_reader ) {
						window.location.replace('reader');
					}
				
				},
				error: function (err) {
					console.log('err',err);
					$("submitted-answer-key").text('Answer: ' + err.message);
				},
			  dataType: 'json'
			});
		}

		
	});
	

})();