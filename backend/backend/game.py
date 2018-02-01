"""Module implementing game object for storage"""

class Game:
	"""A class representing a game of 
	monopoly.
	"""
	def __init__(self, game_id, game_name, time):
		self._id = id
		self._name = game_name
		self._time = time #the time the game object was created
		self._players = []
	
	def getGameID(self):
		"""Return the game's unique, read-only id"""
		return self._id

	def setGameID(self, ID):
		self._id = ID
	
	def getGameName(self):
		"""Return the game's name"""
		return self._name
    
	def setGameName(self, name):
		self._name = name
	
	def getGameTime(self):
		"""Return time the game was created"""
		return self._time

	def setGameTime(self, time):
		self._time = time

	def getNumPlayers(self):
		"""Return number of players joined this game"""
		return len(self._players)

	def addPlayer(self, player):
		"""Add a player to this game"""
		self._player+=[player]

	def removePlayer(self, playerID):
		"""Remove a player from this game"""
		for player in len(range(self._player)):
			if self._player[player].getPlayerID() == playerID:
				self._player.pop(player)
	
