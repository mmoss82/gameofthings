class Player():
    
    def __init__(self, name):
        
        self.name = name.lower()
        self.hasAnswer = False
        self.guessed = False
        self.displayed = False
        self.score = 0
        self.answer = ""

    
    def nextRound(self):
        
        self.guessed = False
        self.hasAnswer = False
        self.answer = ""
        self.displayed = False