from .db import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
  __tablename__ = 'users'

  id = db.Column(db.Integer, primary_key = True)
  email = db.Column(db.String(255), nullable = False, unique = True)
  first_name = db.Column(db.String(40), nullable = False)
  last_name = db.Column(db.String(40), nullable = False)
  verified = db.Column(db.Boolean, nullable = False, default=False)
  active = db.Column(db.Boolean, nullable = False, default=True)
  hashed_password = db.Column(db.String(255), nullable = False)
  created_at = db.Column(db.DateTime, nullable = False)
  updated_at = db.Column(db.DateTime, nullable = False)

  @property
  def password(self):
    return self.hashed_password


  @password.setter
  def password(self, password):
    self.hashed_password = generate_password_hash(password)


  def check_password(self, password):
    return check_password_hash(self.password, password)


  def full_to_dict(self):
    return {
      "id": self.id,
      "email": self.email,
      "firstName": self.first_name,
      "lastName": self.last_name,
      "verified": self.verified,
      "active": self.active,
      "created": self.created_at,
      "updated": self.updated_at
    }

  def public_to_dict(self):
    return {
      "id": self.id,
      "firstName": self.first_name,
      "lastName": self.last_name,
      "verified": self.verified,
      "active": self.active,
      "created": self.created_at
    }