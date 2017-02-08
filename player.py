class Player():
    
    def __init__(self, name):
        self.name = name.lower()
        self.hasAnswer = False
        self.guessed = False
        self.score = 0
        self.answer = ""
    
    def setGuessed(self, guessed ):
        
        if self.guessed != guessed:
            self.guessed = guessed
    
    def nextRound(self):
        
        self.setGuessed(False)
        self.hasAnswer = False
        self.answer = ""