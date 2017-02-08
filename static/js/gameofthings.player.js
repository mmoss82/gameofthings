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

	console.log("user:",user);
	
	var checklogin = (function() {
		$.ajax({
		  type: "GET",
		  url: 'checklogin',
		  success: function (data) {
				console.log('results',data);
				$("#username").text(data.user);
				$("#submitted-answer").text(data.answer);
		  },
			error: function (err) {
				console.log(err);
			},
		});
	})();
	
	socket.on('clear_answers', function(data) {
		$("#submitted-answer").text("");
		$("#submitted-answer-key").text("Answer:");
	})
	
	user_button.on("click", function(e) {
		var username = prompt('Enter your name?');

		username = username.replace(" ", "_");

		var data = {
			"username": username
		}
		$.ajax({
		  type: "POST",
		  url: 'adduser',
		  data: data,
		  success: function (data) {
				if( username != null ) {
					$("#username").text(username);
				}
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});		
	});
	
	
	submit.on("click", function(e) {
		e.preventDefault();		
		console.log("submitting");
		var answer_str = $("#answer").val();
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
				$("#submitted-answer").text(answer_str);
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
		
	});
	

})();