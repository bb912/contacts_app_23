from flask import Flask, render_template, request, redirect, url_for, make_response

app = Flask(__name__)

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database_setup import Base, User, Contact



# Connect to Database and create database session
engine = create_engine('mysql://cop433123:password@servername/cop43312_database')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)



"""
api functions for contacts
"""
from flask import jsonify


# gets all contacts for a specific user_id
def get_contacts(user_id):
    contacts = session.query(Contacts).filter_by(user_id=user_id)
    return jsonify(contacts=[c.serialize for c in contacts])

# get a single contact by its id number
def get_contact(contact_id):
    contact = session.query(Contacts).filter_by(id=contact_id).one()
    return jsonify(Contact=contact.serialize)

# create a new contact given all information
def create_new_contact(user_id, first_name, last_name, phone, email):
    added_contact = Contact(first_name=first_name, last_name=last_name,
                            phone=phone, email=email, user_id=user_id)
    session.add(added_contact)
    session.commit()
    return jsonify(Contact=added_contact.serialize)

# delete contact by contact ID
def delete_contact(id):
    contact_to_delete = session.query(Contact).filter_by(id=id).one()
    session.delete(contact_to_delete)
    session.commit()
    return "Removed contact with id %s" % contact_id


# update an existing contact
def update_contact(contact_id, first_name, last_name, phone, email):
    updated_contact = session.query(Contact).filter_by(id=contact_id).one()
    if first_name:
        updated_contact.first_name = first_name
    if last_name:
        updated_contact.last_name = last_name
    if phone:
        updated_contact.phone = phone
    if email:
        updated_contact.email = email
    session.add(updatedBook)
    session.commit()

    return "Updated contact with id %s" % contact_id

# list contacts or add a contact (for a specific user)

# GET request requires user_id in json

#POST request requires first_name, last_name, phone, email, user_id,

# LISTING ALL CONTACTS OR ADDING A CONTACT FOR A USER
@app.route('/')
@app.route('/contactsApi', methods=['GET', 'POST'])
def contactsFunction():
	# list all contacts for user
    if request.method == 'GET':
        return get_contacts(request.args.get('user_id', ''))
    elif request.method == 'POST':
        first = request.args.get('first_name', '')
        last = request.args.get('last_name', '')
        phone = request.args.get('phone', '')
        email = request.args.get('email', '')
        user = request.args.get('user_id', '')
        return create_new_contact(first, last, phone, email, user)


# get a specific contact by contact ID, or update contact, or delete contact
@app.route('/contactsApi/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def contactsFunctionID(id):
    if request.method == 'GET':
        return get_contact(id)

    elif request.method == 'PUT':
        first = request.args.get('first_name', '')
        last = request.args.get('last_name', '')
        phone = request.args.get('phone', '')
        email = request.args.get('email', '')
        user = request.args.get('user_id', '')
        return update_contact(id, first, last, phone, email, user)

    elif request.method == 'DELETE':
        return delete_contact(id)


'''
USER API
'''
# get personal info given a single user_id
def user_info(id):
	user = session.query(User).filter_by(id=id).one()
	return jsonify(User=user.serialize)

def create_new_user(first_name, last_name, login, password):
	added_user = User(first_name=first_name, last_name=last_name,
                            login=login, password=password)
    session.add(added_user)
    session.commit()
    return jsonify(User=added_user.serialize)

def update_user(id, first_name, last_name, login, password):
	updated_user = session.query(User).filter_by(id=id).one()
	if first_name:
        updated_user.first_name = first_name
    if last_name:
        updated_user.last_name = last_name
    if login:
        updated_user.login = phone
    if password:
        updated_user.password = email
	session.add(updatedBook)
	session.commit()

	return "Updated User with id %s" % id


# either get the user's personal info or create a new user
@app.route('/')
@app.route('/userApi', methods=['GET', 'POST'])
def usersFunction():
	# list all contacts for user
    if request.method == 'GET':
        return user_info(request.args.get('id', ''))
    elif request.method == 'POST':
        first = request.args.get('first_name', '')
        last = request.args.get('last_name', '')
        login = request.args.get('login', '')
        password = request.args.get('password', '')
        return create_new_user(first, last, login, password)

# for updating User's personal information
@app.route('/userApi/<int:id>', methods=['PUT'])
def usersFunctionID(id):
    if request.method == 'PUT':
        first = request.args.get('first_name', '')
        last = request.args.get('last_name', '')
        login = request.args.get('login', '')
        password = request.args.get('password', '')
        return update_user(id, first, last, login, password)



if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=4996)
