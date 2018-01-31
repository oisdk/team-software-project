class Game:
	def __init__(self, game_id, game_name, time):
		self._id = id
		self._name = game_name
		self._time = time #the time the game object was created
		self._players = []

	def getGameID(self):
		return self._id

	def setGameID(self, ID):
		self._id = ID

	def getGameName(self):
		return self._name

	def setGameName(self, name):
		self._name = name

	def getGameTime(self):
		return self._time

	def setGameTime(self, time):
		self._time = time

	def getNumPlayers(self):
		return len(self._players)

	def addPlayer(self, player):
		self._player+=[player]

	def removePlayer(self, playerID):
		for player in len(range(self._player)):
			if self._player[player].getPlayerID() == playerID:
				self._player.pop(player)