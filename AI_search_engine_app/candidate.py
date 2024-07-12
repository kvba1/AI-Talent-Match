class Candidate:
    def __init__(self, category, resume, phone_number, email, first_name, last_name, score):
        self.category = category
        self.resume = resume
        self.phone_number = phone_number
        self.email = email
        self.first_name = first_name
        self.last_name = last_name
        self.score = score
    
    def to_dict(self):
        return {
            'category': self.category,
            'resume': self.resume,
            'phone_number': self.phone_number,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'score': self.score
        }
