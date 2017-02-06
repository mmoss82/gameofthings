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
	
	socket.on('answer_submitted', function(data) {
		addPlayer(data.name);
		console.log(data);
	});
	
	$("#show-answers").on("click", function(e) {
		$.ajax({
		  type: "GET",
		  url: 'showanswers',
		  success: function (data) {
				console.log(data);
		  },
			error: function (err) {
				console.log(err);
			},
		});
	});
	
	var getAnswers = (function () {
		$.ajax({
		  type: "GET",
		  url: 'getanswers',
		  success: function (data) {
				console.log(data);
				var answers_array = data.answers;				
				for( var i = 0; i < answers_array.length; i ++ ) {
				  addPlayer( answers_array[i].name );
				}
		  },
			error: function (err) {
				console.log(err);
			},
		  dataType: 'json'
		});
		
	})();
	
	var addPlayer = function( name ) {
		var button = $('<button class="btn btn-lg name-btn">' + name + "</button>");
		button.attr("id",name);
		button.bind("click", guessedClickEvent);
		players.append(button);
	}
	
	var guessedClickEvent = function (e) {
		var name = e.toElement.id;
		$.ajax({
		  type: "GET",
		  url: 'answerguessed/' + name,
		  success: function (data) {
				console.log(data);
		  },
			error: function (err) {
				console.log(err);
			},
		});
	};
	

})();