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

var gameofthings = (function () {
  'use strict';

	console.log("test");
	socket.on('submit_answer', function(data) {
		
		var answers = $("#answers-table");
		var players = $("#players-table");
		
		answers.append($("<tr><td>" + data.answer + "</td></tr>"));
		players.append($("<tr><td>" + data.player + "</td></tr>"));
		
		console.log(data);
	});
	
	socket.emit('getAnswers',{});

})();