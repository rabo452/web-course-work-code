class Movie:
    def __init__(self, _id: str, title: str, thumbnail: str, budget: float, mainCharacters: list, description: str, year: int):
        self.id = str(_id)
        self.title = title
        self.thumbnail = thumbnail
        self.budget = budget
        self.mainCharacters = mainCharacters
        self.description = description
        self.year = year