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
		  },
			error: function (err) {
				console.log(err);
			},
		});
	})();
	
	user_button.on("click", function(e) {
		var username = prompt('What is your name?');
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
		
		var data = {
			'answer':$("#answer").val(),
			'username':$("#username").text()
		};
		
		console.log(data);
		$.ajax({
		  type: "POST",
		  url: 'submitAnswer',
		  data: data,
		  success: function (data) {
		  	console.log(data);
				answer.val("");
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});
		
	});
	
	socket.on('answer_submitted', function(data) {
		console.log("test");
		if( data.success ) {
		} else {
			console.log(data.message);
		}
	});
	
	

})();