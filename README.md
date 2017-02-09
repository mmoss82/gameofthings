# Game of Things Helper

## This application makes playing Game of Things easier.

Users can submit their answers with their phones

Remaining answers and users are displayed on a screen so all can easily see.
  ( you no longer have to repeat all of the answers for each guesser. They can just read it themselves )

### Details:

**Back-end:** Python Flask, Flask-Socket-io

**Front-end:** jQuery, Bootstrap, Socket.io

The game and player data is stored in memory, no db yet so if the server restarts during play, that round is lost.

### Installation

1. If you don't already have it, install pip:
```sudo easy_install pip```

2. Next, use pip to install the requirements:
```sudo pip install -r requirements.txt```

(If you're on OS X El Capitan or above, you may need to use this command instead, 
as pip will get hung up trying to uninstall a built-in version of six 1.4.1:
```sudo pip install -r requirements.txt --ignore-installed six```)

### How to use:

* Run the server on a computer connected to a TV that everyone playing can see.

```python
python app.py
```

* Launch browser on this display URL = http://<machine-ip-address>:5000/board

* Each user connects to this url on their phone: http://<machine-ip-address>:5000

	They create a user name and submit their answer each round.

* The "reader" connects to: http://<machine-ip-address>:5000/reader ( this should be passed around and dynamically loaded on next reader's device )

* The "reader" will see a list of names on their device when that user submits their answer.

* When all answers are submitted, "reader" will tap the "SHOW ANSWERS" button to populate the board display.

*	"Reader" will tap the users name when their answer is guessed. This will update the board. 

* Fun will ensue.