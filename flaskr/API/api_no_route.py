
from flask import Flask, render_template, request, redirect, url_for, make_response
import hashlib
import pymysql
from sqlalchemy import create_engine, or_, asc
from sqlalchemy.orm import sessionmaker
from database_setup import Base, User, Contact
from gevent.pywsgi import WSGIServer
from flask_cors import CORS

app = Flask(__name__)
# Connect to Database and create database session
engine = create_engine('mysql+mysqlconnector://cop43312_db:accessMyData@localhost:3306/cop43312_database')
Base.metadata.bind = engine

DBSession = sessionmaker(bind=engine)
session = DBSession()
CORS(app, supports_credentials=True, expose_headers='Authorization')

@app.errorhandler(404)
def not_found():
		return make_response(jsonify({'error': 'Not found'}), 404)



"""
api functions for contacts
"""
from flask import jsonify


# gets all contacts for a specific user_id
def get_contacts(user_id):
		contacts = session.query(Contact).filter_by(UserID=user_id)
		return jsonify(Contact=[c.serialize for c in contacts])

# get a single contact by its id number
def get_contact(contact_id):
		contact = session.query(Contact).filter_by(ID=contact_id).one()
		return jsonify(Contact=contact.serialize)

# create a new contact given all information
def create_new_contact(user_id, first_name, last_name, phone, email):
		added_contact = Contact(FirstName=first_name, LastName=last_name,
														PhoneNumber=phone, Email=email, UserID=user_id)
		session.add(added_contact)
		session.commit()
		return "Added contact with id %s" % added_contact.ID

# delete contact by contact ID
def delete_contact(id):
		contact_to_delete = session.query(Contact).filter_by(ID=id).one()
		session.delete(contact_to_delete)
		session.commit()
		return "Removed contact with id %s" % id


# update an existing contact
def update_contact(contact_id, first_name, last_name, phone, email):
		updated_contact = session.query(Contact).filter_by(ID=contact_id).one()

		if first_name:
				updated_contact.FirstName = first_name
		if last_name:
				updated_contact.LastName = last_name
		if phone:
				updated_contact.PhoneNumber = phone
		if email:
				updated_contact.Email = email
		session.add(updated_contact)
		session.commit()

		return "Updated contact with id %s" % contact_id

# list contacts or add a contact (for a specific user)

# GET request requires user_id in json

#POST request requires first_name, last_name, phone, email, user_id,

#ADDING A CONTACT FOR A USER
@app.route('/')
@app.route('/contactsApi', methods=['POST'])
#@cross_origin()
def contactsFunction():

		#if request.method == "OPTIONS": # CORS preflight
        #		return _build_cors_prelight_response()

		body = request.get_json(force=True)
		#body = request.text
		#data = json.loads(data)
		#print(body)

		# list all contacts for user
		#if request.method == 'GET':
		#		return get_contacts(body.get('UserID', ''))
		#elif request.method == 'POST':



		first = body.get('FirstName', '')
		last = body.get('LastName', '')
		phone = body.get('PhoneNumber', '')
		email = body.get('Email', '')
		user = body.get('UserID', '')
		return create_new_contact(user, first, last, phone, email)


# get a specific contact by contact ID, or update contact, or delete contact
@app.route('/contactsApi/<int:id>', methods=['GET', 'POST'])
#@cross_origin()
def contactsFunctionID(id):
		if request.method == 'GET':
				return get_contact(id)

		elif request.method == 'POST':

				body = request.get_json(force=True)

				first = body.get('FirstName', '')
				last = body.get('LastName', '')
				phone = body.get('PhoneNumber', '')
				email = body.get('Email', '')
				user = body.get('UserID', '')
				return update_contact(id, first, last, phone, email)


# get a specific contact by contact ID, or update contact, or delete contact
@app.route('/contactsApi/<int:id>/delete', methods=['POST'])
#@cross_origin()
def contactsFunctionDelete(id):
		return delete_contact(id)


# search contacts ordered by last name.
# Needs SearchTerm and UserID in request args, no body
@app.route('/contactsApi/search', methods=['GET', 'POST'])
def searchFunctionID():

	body = request.args

	search_term = body.get('SearchTerm')
	user = body.get('UserID')

	return get_searched_contacts(search_term, user)

def get_searched_contacts(search_term, user):

	search_term = "{}%".format(search_term)

	contacts_for_user = \
		session.query(Contact).filter_by(UserID=user).filter( \
			or_(Contact.FirstName.like(search_term), \
				Contact.LastName.like(search_term), \
				Contact.PhoneNumber.like(search_term), \
				Contact.Email.like(search_term))).order_by(asc(Contact.LastName))

	return jsonify({idx: c.serialize for idx, c in enumerate(contacts_for_user)})



'''
USER API
'''
# get personal info given a single user_id
def user_info(id):

		user = session.query(User).filter_by(ID=id).one()
		return jsonify(User=user.serialize)

def create_new_user(first_name, last_name, login, password):

		same_user_name = session.query(User).filter_by(Login=login).count()

		if same_user_name > 0:
			return "Username is already in Use, Please Choose another", 409

		hash_pass = hash_hex(password)

		added_user = User(FirstName=first_name,LastName=last_name,Login=login,Password=hash_pass)
		session.add(added_user)
		session.commit()

		return "Added user with ID %s" % added_user.ID, 200

		#return jsonify(User=added_user.serialize)



def update_user(id, first_name, last_name, login, password):

		updated_user = session.query(User).filter_by(ID=id).one()
		if first_name:
				updated_user.FirstName = first_name
		if last_name:
				updated_user.LastName = last_name
		if login:
				updated_user.Login = login
		if password:
				updated_user.Password = hash_hex(password)
		session.add(updated_user)
		session.commit()

		return "Updated User with id %s" % id

# returns hex digest version of hashed md5 password
def hash_hex(password):
	return hashlib.md5(password.encode()).hexdigest()

#verifies password against password in database
def verifyPassword(login, password):

	user_to_verify = session.query(User).filter_by(Login=login).one()

	if user_to_verify is not None:
		if hash_hex(password) == user_to_verify.Password:

			return jsonify(User=user_to_verify.serialize)
			#return "Correct Password for %s" % login
		else:
			return "Incorrect Password for %s" % login
	else:
		return "User %s not Found" % login



# either get the user's personal info or create a new user
@app.route('/')
@app.route('/userApi', methods=['GET', 'POST'])
#@cross_origin()
def usersFunction():

		body = request.get_json()

		# list all contacts for user
		if request.method == 'GET':
				return user_info(body.get('ID', ''))

		# for registering
		elif request.method == 'POST':
				first = body.get('FirstName', '')
				last = body.get('LastName', '')
				login = body.get('Login', '')
				password = body.get('Password', '')
				return create_new_user(first, last, login, password)


@app.route('/')
@app.route('/userApi/login', methods=['POST'])
#@cross_origin()
def userLogin():

	body = request.get_json()

	# for logging in
	if request.method == 'POST':
		return verifyPassword(body.get('Login'), body.get('Password'))


# for updating User's personal information
@app.route('/userApi/<int:id>', methods=['PUT'])
#@cross_origin()
def usersFunctionID(id):
		body = request.get_json()

		if request.method == 'PUT':
				first = body.get('FirstName', '')
				last = body.get('LastName', '')
				login = body.get('Login', '')
				password = body.get('Password', '')
				return update_user(id, first, last, login, password)


if __name__ == '__main__':
		pymysql.install_as_MySQLdb()
		app.debug = False
		http_server = WSGIServer(('', 4996), app)

		http_server.serve_forever()
		#app.run(host='0.0.0.0', port=4996)
