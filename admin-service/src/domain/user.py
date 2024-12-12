class User:
    def __init__(self, id: str, email: str, username: str, role: str):
        self.id = str(id) 
        self.email = email
        self.username = username
        self.role = role

    def __repr__(self):
        return f"User(id={self.id}, email={self.email}, username={self.username}, role={self.role})"
