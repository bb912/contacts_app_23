# much of this code has been modified from
# https://www.kite.com/blog/python/flask-tutorial/

import sys

# for creating the mapper code
from sqlalchemy import Column, ForeignKey, Integer, String

# for configuration and class code
from sqlalchemy.ext.declarative import declarative_base

# for creating foreign key relationship between the tables
from sqlalchemy.orm import relationship

# for configuration
from sqlalchemy import create_engine
import hashlib
# create declarative_base instance
Base = declarative_base()


# We will add classes for both tables

class User(Base):
        __tablename__ = 'Users' # or whatever table is called


        ID = Column(Integer, primary_key=True) # this is user_id in contacts table
        FirstName = Column(String(50), nullable=False)
        LastName = Column(String(50), nullable=False)
        Login = Column(String(50))
        Password = Column(String(50), nullable=False)

        @property
        def serialize(self):
                return {
                        'FirstName': self.FirstName,
                        'LastName': self.LastName,
                        'Login': self.Login,
                        #'Password': self.Password, We should never be sharing this password with frontend
                        'ID': self.ID,
                }

class Contact(Base):
        __tablename__ = 'Contacts'

        ID = Column(Integer, primary_key=True)
        FirstName = Column(String(50), nullable=False)
        LastName = Column(String(50), nullable=False)
        Email = Column(String(80), nullable=False)
        PhoneNumber = Column(String(20), nullable=False)
        UserID = Column(Integer, nullable=False)

        @property
        def serialize(self):
                return {
                        'FirstName' : self.FirstName,
                        'LastName' : self.LastName,
                        'email' : self.Email,
                        'phone' : self.PhoneNumber,
                        'ID': self.ID,
                        'UserID' : self.UserID,
                }

# creates a create_engine instance at the bottom of the file
#engine = create_engine('mysql://username:password@servername/databasename')
#engine = create_engine('mysql://cop43312_db:accessMyData@198.12.250.5/cop43312_database.db')
#engine = create_engine('mysql://cop43312_db:accessMyData@localhost/cop43312_database.db')
#engine = create_engine('mysql://cop433123:^&4%U7rFNqDUpy@localhost/cop43312_database.db')
engine = create_engine('mysql+mysqlconnector://cop43312_db:accessMyData@localhost:3306/cop43312_database')
Base.metadata.create_all(engine)


'''
        GET: The GET method is only used to retrieve information from the given server. Requests using this method should only recover data and should have no other effect on the data.
        POST: A POST request is used to send data back to the server using HTML forms.
        PUT: A PUT request replaces all the current representations of the target resource with the uploaded content.
        DELETE: A DELETE request removes all the current representations of the target resource given by URI.
'''
