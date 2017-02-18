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

// TODO FIX REFRESH - SHOW GUESSED ANSWERS

var gameofthingsb = (function () {
  'use strict';

	console.log("test");
	
	var answers = $("#answers-table");
	var players = $("#board-players-table tr");
	var player_list = [];

	// Get the submitted answers from the server.
	// This will protect the answers from being lost if the
	// page is refreshed.
	var getAnswers = (function () {
		$.ajax({
		  type: "GET",
		  url: 'getanswers',
		  success: function (data) {
				console.log('answers:',data);
				var answers_array = data.answers;				
				for( var i = 0; i < answers_array.length; i ++ ) {					
					if(player_list.indexOf(answers_array[i].username) < 0) {
						player_list.push(answers_array[i].username);
					}
				}
				// if all the answers are displayed, we can show the users.
				if(data.all_displayed) {
					showPlayers(player_list);
				}
				// show the answers either way.
				showAnswers(answers_array);
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});
	})();
	
	// initial load question and set on display
	var getQuestion = (function(){
		$.ajax({
		  type: "GET",
		  url: 'getquestion',
		  success: function (data) {
				var q = data.question;
				if(q != null) {
					$("#board-question").text(data.question);					
				}
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});
	})();
	
	// when you trigger a new round, clear the board
	socket.on('clear_answers', function(data) {
		if( 0 < answers.find("tbody tr").length ) {
			$(answers.find("tbody")[0]).empty();
			players.empty();
		} else {
			$(answers.find("tbody")[0]).empty();
			players.empty();
		}
		$("#board-question").empty();
	});
	
	// socket connection when question is set
	socket.on('set_question', function(data) {
		$("#board-question").text(data.question);
	});
	
	// when the reader clicks an answer, this handles what the board does
	socket.on('answer_clicked', function(data) {
		var targets = $(".player-" +  data.username);

		if( 0 < targets.length ){ // they are displayed, toggle guessed
			targets.each( function(i, row) {
				console.log('found');
				$(row).toggleClass("player-guessed");
			})
		} else { // not displayed yet, display them
			showAnswers([data]);
			if(player_list.indexOf(data.username) < 0) {
				player_list.push(data.username);
			}
			if(data.all_displayed) {
				showPlayers(player_list);
			}
		}
	});
	
	// randomize the players so they're not in the same order
	// as the answers! I stole this.
	var shuffle = function(array) {
	  var currentIndex = array.length, temporaryValue, randomIndex;

	  // While there remain elements to shuffle...
	  while (0 !== currentIndex) {

	    // Pick a remaining element...
	    randomIndex = Math.floor(Math.random() * currentIndex);
	    currentIndex -= 1;

	    // And swap it with the current element.
	    temporaryValue = array[currentIndex];
	    array[currentIndex] = array[randomIndex];
	    array[randomIndex] = temporaryValue;
	  }

	  return array;
	};
	
	// Populate the answers on the board.
	var fillAnswerTable = function(answer, username, guessed) {
		var 
			row = $('<tr><td>' + answer + '</td></tr>'),
			player = $(".player-" + username);
		
		row.addClass('player-' + username);

		if(guessed) {
			row.addClass('player-guessed'); // answer
			player.addClass('player-guessed'); // username
		}

		answers.append(row);
	};
	
	// Populate the player names on the board
	var fillPlayerTable = function(username) {
		var player = $('<td>' + username + '</td>');
		
		// decide whether or not this answer has been guessed yet or not
		var guessed = $('.player-' + username).hasClass('player-guessed');
		
		if(guessed) {player.addClass('player-guessed');}
		player.addClass('player-' + username);
		players.append(player);
	};
	
	var showPlayers = function(player_list) {
		player_list = shuffle(player_list);
		for( var i = 0; i < player_list.length; i ++ ) {
			fillPlayerTable(player_list[i]);
		}			
	};
	
	var showAnswers = function (answers_array) {
		for( var i = 0; i < answers_array.length; i ++ ) {
			if(answers_array[i].displayed) {
				fillAnswerTable(
					answers_array[i].answer,
				  answers_array[i].username, 
					answers_array[i].guessed
				);
			}
		}	
	};
	
})();