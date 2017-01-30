from flask import Flask
from flask import request
from flask import send_from_directory
from flask_socketio import SocketIO
from flask_socketio import emit

import os

app = Flask(__name__, static_url_path='/static')

app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["DEBUG"] = True
app.config["TRAP_HTTP_EXCEPTIONS"] = True

socketio = SocketIO(app)

class Player():
    
    def __init__(self, name):
        self.name = name.lower()
        self.hasAnswer = False
        self.guessed = False
        self.score = 0
    
class Game():
    
    def __init__(self):
        self.round = 1
        self.players = []
        
    def addPlayer(self, player):
        player = player.lower()
        player = Player(player)
        if not self.findPlayer(player.name):
            self.players.append( player )

    def addAnswer(self, playername, answer):
        playername = playername.lower()
        player = self.findPlayer(playername)
        
        if player != False:
            player.answer = answer
            player.hasAnswer = True
            
        else:
            print "player not found: %s" % playername

    def findPlayer(self, playername):
                
        playername = playername.lower()
        print self.players
        for player in self.players:
            print player.name, playername
            if player.name == playername:
                print "matched!"
                return player
                
        print "not matched"
        return False
            
game = Game()
@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static/img'),
                               'favicon.png', mimetype='image/vnd.microsoft.icon')
                               
@app.route("/")
def getHome():
    return app.send_static_file('index.html')

@app.route("/board", methods=['GET'])
def getBoard():
    return app.send_static_file('board.html')

@app.route("/player", methods=['GET'])
def getPlayer():
    return app.send_static_file('player.html')

@app.route("/addplayer", methods=['POST'])
def addPlayer():
    playername = request.form["name"].lower()
    game.addPlayer(playername)
    return "Player %s Added" % playername, 200

@app.route("/submitanswer", methods=['POST'])
def submitAnswer():

    playername = request.form["name"]
    answer = request.form["answer"]

    player = game.findPlayer(playername)
    if player != False:
        if not player.hasAnswer:
            game.addAnswer(playername, answer)
            socketio.emit( 'submit_answer', {'answer' : answer, 'player' : playername})
            return "Answer %s Submitted" % answer, 200
        else:
            return "Answer already submitted: %s" % player.answer, 500
    else:
        return "User not added", 404

@socketio.on('connect')
def test_connect():
    print "# user connected"
    emit('my response', {'data': 'Connected'})

@socketio.on('getAnswers')
def getAnswers(data):
    for player in game.players:
        if player.hasAnswer:
            emit( 'submit_answer', 
                {
                    'answer' : player.answer,
                    'player' : player.name
                }
            )

if __name__ == "__main__":
    socketio.run(app)
    
    