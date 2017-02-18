from player import Player

class Game():
    
    def __init__(self):
        self.round = 1
        self.players = []
        self.reader_index = 0
        self.answers_submitted = False
        self.question = None
        
    def addPlayer(self, name):
        
        name = name.lower()
        player = Player(name)
        
        if not self.findPlayer(player.name):
            self.players.append( player )

    def addAnswer(self, username, answer):

        username = username.lower()
        player = self.findPlayer(username)

        had_answer = False

        if player != False:
            
            had_answer = player.hasAnswer
            player.answer = answer
            player.hasAnswer = True
            
        else:
            print "player not found: %s" % username

        return had_answer
        
    def findPlayer(self, username):
                
        username = username.lower()

        for player in self.players:
            if player.name == username:
                return player
                
        print "not matched"
        return False
        
    def isReader(self, player):
        
        return self.players.index(player) == self.reader_index
    
    def incrementReaderIndex(self):        

        if self.reader_index < len(self.players) - 1:
            self.reader_index += 1
        else:
            self.reader_index = 0
    
    def nextRound(self):

        self.answers_submitted = False
        self.question = None
        for player in self.players:
            player.nextRound()
            
    def getNumPlayers(self):
        
        return len(self.players)
        
    def getNumAnswered(self):
        
        n = 0
        for p in self.players:
            if p.hasAnswer:
                n += 1
        return n
        
    def getNumDisplayed(self):
        
        n = 0
        for p in self.players:
            if p.displayed:
                n+= 1        
        return n
        