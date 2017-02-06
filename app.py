from flask import Flask
from flask import request
from flask import send_from_directory
from flask import session
from flask import escape
from flask import make_response
from flask import render_template
from flask import flash
from flask import jsonify

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
    
    def setGuessed(self, bool ):
        
        if self.guessed != bool:
            self.guessed = bool
    
class Game():
    
    def __init__(self):
        self.round = 1
        self.players = []
        
    def addPlayer(self, name):
        
        name = name.lower()
        player = Player(name)
        
        if not self.findPlayer(player.name):
            self.players.append( player )

    def addAnswer(self, username, answer):

        username = username.lower()
        player = self.findPlayer(username)

        if player != False:
            player.answer = answer
            player.hasAnswer = True
            
        else:
            print "player not found: %s" % username

    def findPlayer(self, username):
                
        username = username.lower()

        for player in self.players:
            if player.name == username:
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

@app.route("/checklogin")
def checkLogin():
    print 'checking login'
    if 'username' in session:
        username = session['username']
        if game.findPlayer(username) == False:
            game.addPlayer(username)
        return jsonify({'user':username, 'status':200 })
    else:
        return jsonify({'status':401})

@app.route("/board", methods=['GET'])
def getBoard():
    return app.send_static_file('board.html')

@app.route("/reader", methods=['GET'])
def getReader():
    return app.send_static_file('reader.html')

@app.route("/adduser", methods=['POST'])
def addUser():
    print request.form

    username = request.form["username"].lower()
    session['username'] = username
    game.addPlayer(username)
    
    return jsonify({'status_code':200})

@app.route("/guessed", methods=['POST'])
def guessed():
    print request.form

    username = request.form["username"].lower()

    player = game.findPlayer(username)
    
    if player != False:
    
        if player.hasAnswer:
            player.setGuessed( True )
            emit('playerGuessed', {'name': username})
            return jsonify({'status_code':200})
        else:
            return jsonify({'status_code':403,'message':'player did not submit answer'})
            
   
    else:
        return jsonify({'status_code':500,'message':'player does not exist'})


@app.route('/submitAnswer', methods=['POST'])
def submitAnswer():
    
    data = request.form
    print data
    answer = data["answer"]
    
    if 'username' in session:
        print 'Logged in as %s' % escape(session['username'])
    
    username = data["username"]
    print username
    player = game.findPlayer(username)
    
    if player != False:
    
        if not player.hasAnswer:
            game.addAnswer(username, answer)
            socketio.emit("answer_submitted", {"name" : username, "answer": answer})
            return jsonify({'status_code':200})
        else:
            return jsonify({'status_code':500,'message':'answer already submitted'})
   
    else:
        return jsonify({'status_code':500,'message':'player does not exist'})

@app.route('/getanswers', methods=['GET'])
def getAnswers():
    answers = []

    for player in game.players:
        if player.hasAnswer:
            answers.append( { 'name':player.name, 'answer': player.answer })

    return jsonify( {'answers': answers, 'status_code':200} )

@app.route('/answerguessed/<username>', methods=['GET'])
def answerGuessed(username):
    print 'guessed' + username
    player = game.findPlayer(username)
    
    if player != False:
        player.setGuessed(not player.guessed)
        socketio.emit("player_guessed", {"username" : username})
        return jsonify({'status_code':200})
    else:
        return jsonify({'status_code':500,'message':'player does not exist'})
    
@app.route('/showanswers', methods=['GET'])
def showAnswers():
    answers = []

    for player in game.players:
        if player.hasAnswer:
            answers.append({'name':player.name, 'answer':player.answer})
    
    socketio.emit('show_answers', {'answers':answers})
    return jsonify({'status_code':200})
    
@socketio.on('connect')
def test_connect():
    print "# user connected"
    emit('my response', {'data': 'Connected'})

app.secret_key = "secretforrealthough"

if __name__ == "__main__":
    socketio.run(app)#,host="192.168.1.7")
    
    