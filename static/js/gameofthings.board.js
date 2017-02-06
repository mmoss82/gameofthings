/*
 * gameofthings.js
 */
/*jslint    browser : true, continue : true,
  devel : true, indent: 2,  maxerr : 50,
  newcap: true, nomen : true, plusplus: true,
  regexp: true, sloppy: true, vars: false,
  white: true
 */
/* global $, players, answers */

var gameofthingsb = (function () {
  'use strict';

	console.log("test");
	
	var player_array = [];
	var answers = $("#answers-table");
	var players = $("#players-table tr");

	/* disabled for now - populated from reader control
	socket.on('answer_submitted', function(data) {
		
		fillAnswerTable(data.answer);
		fillPlayerTable(data.name);
		
		console.log(data);
	});
	*/
	
	socket.on('player_guessed', function(data) {
		toggleGuessed(data.username);
	});
	
	socket.on('show_answers', function(data) {
		if( 0 < answers.find("tbody tr").length ) {
			$(answers.find("tbody")[0]).empty();
			players.empty();
		} else {
			$(answers.find("tbody")[0]).empty();
			players.empty();
			showAnswers(data.answers);
		}
	})
	
	var toggleGuessed = function(username){
		var targets = $(".player-" +  username);
		targets.each( function(i, row) {
			$(row).toggleClass("player-guessed");
		})
	}
	
	var fillAnswerTable = function(answer, username) {
		var row = $('<tr><td>' + answer + '</td></tr>');
		row.attr('class', "player-" + username);
		answers.append(row);
	};
	
	var fillPlayerTable = function(username) {
		var data = $('<td>' + username + '</td>');
		data.attr('class', "player-" + username);
		players.append(data);		
	};
	
	var showAnswers = function (answers_array) {
  	console.log(answers_array);
		var username;
		var username_array = [];
		for( var i = 0; i < answers_array.length; i ++ ) {
			username = answers_array[i].name;
			fillAnswerTable(answers_array[i].answer, username);
			username_array.push(username);
		}	

		username_array.sort();		
		//o.sort(function(a, b){return 0.5 - Math.random()})

		for( var i = 0; i < username_array.length; i ++ ) {
			fillPlayerTable(username_array[i]);			
		}
	};
	
})();