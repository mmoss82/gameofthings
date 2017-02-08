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

from game import Game

import os

app = Flask(__name__, static_url_path='/static')

app.config["PROPAGATE_EXCEPTIONS"] = True
app.config["DEBUG"] = True
app.config["TRAP_HTTP_EXCEPTIONS"] = True

socketio = SocketIO(app)
            
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

    if 'username' in session:
        username = session['username']
        player = game.findPlayer(username)
        
        if player == False:
            game.addPlayer(username)
            answer = ""
        else:
            answer = player.answer
        
        response = jsonify({
            'user':username,
            'answer':answer
        })
        response.status_code = 200
        return response
    else:
        response = jsonify({})
        repsonse.status_code = 401
        return response

@app.route("/board", methods=['GET'])
def getBoard():
    return app.send_static_file('board.html')

@app.route("/reader", methods=['GET'])
def getReader():
    return app.send_static_file('reader.html')

@app.route("/adduser", methods=['POST'])
def addUser():

    username = request.form["username"].lower()
    session['username'] = username
    game.addPlayer(username)
    
    response = jsonify({})
    response.status_code = 200
    return response

@app.route("/guessed", methods=['POST'])
def guessed():
    
    username = request.form["username"].lower()
    player = game.findPlayer(username)
    
    if player != False:
    
        if player.hasAnswer:
            player.setGuessed( True )
            emit('playerGuessed', {'name': username})
            response = jsonify({})
            response.status_code = 200
            return response
        else:
            response = jsonify({'message':'player did not submit answer'})
            response.status_code = 403
            return response

    else:
        response = jsonify({'message':'player does not exist'})
        response.status_code = 500
        return response

@app.route('/submitAnswer', methods=['POST'])
def submitAnswer():
    
    answer = request.form["answer"]
    username = request.form["username"]
    player = game.findPlayer(username)
    
    if player != False:    
        if not game.answers_submitted:

            had_answer = game.addAnswer(username, answer)

            if not had_answer:
                socketio.emit("answer_submitted", {
                    "name" : username,
                    "answer": answer
                })
            
            if game.isReader(player):
                response = jsonify({'is_reader':True})
                response.status_code = 200
                return response
            else:
                return jsonify({'is_reader':False})
                response.status_code = 200
                return response
                
        else:
            response = jsonify({
                'is_reader':False,
                'message':'answer already submitted'
            })
            response.status_code = 500
            return response
   
    else:
        response = jsonify({
            'message':'player does not exist',
            'is_reader':False            
        })
        response.status_code = 500
        return response
        
@app.route('/getanswers', methods=['GET'])
def getAnswers():
    answers = []

    for player in game.players:
        if player.hasAnswer:
            answers.append({
                'name':player.name,
                'answer': player.answer
            })
    response = jsonify({'answers':answers})
    response.status_code = 200
    return response
    
@app.route('/answerguessed/<username>', methods=['GET'])
def answerGuessed(username):
    player = game.findPlayer(username)
    
    if player != False:
        player.setGuessed(not player.guessed)
        socketio.emit("player_guessed", {"username" : username})
        response = jsonify({})
        response.status_code = 200
        return response
    else:
        response = jsonify({'message':'player does not exist'})
        response.status_code = 500
        return response
        
@app.route('/showanswers', methods=['GET'])
def showAnswers():
    answers = []

    game.answers_submitted = True

    for player in game.players:
        if player.hasAnswer:
            answers.append({'name':player.name, 'answer':player.answer})
    
    socketio.emit('show_answers', {'answers':answers})
    response = jsonify({})
    response.status_code = 200
    return response
    
@app.route('/nextround', methods=['GET'])
def nextRound():
    game.incrementReaderIndex()
    game.nextRound()
    socketio.emit('clear_answers', {})
    response = jsonify({})
    response.status_code = 200
    return response

@socketio.on('connect')
def test_connect():
    print "# user connected"
    emit('my response', {'data': 'Connected'})

app.secret_key = "secretforrealthough"

if __name__ == "__main__":
    socketio.run(app)#,host="192.168.1.7")
    
    