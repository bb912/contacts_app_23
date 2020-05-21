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

# HOME
@app.route('/', methods=['GET', 'POST'])
def home():
    """ Session control"""
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        # what to do here?

        return render_template('index.html')

# LOGIN PAGE
@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login Form"""
    if request.method == 'GET':
        # NEED THIS HTML
        return render_template('login.html')

    else if request.method == 'POST':
        name = request.form['login']
        passw = request.form['password']
        try:
            user_search = session.query(User).filter_by(login=name, password=passw).first()
            if user_search is not None:
                session['logged_in'] = True
                return redirect(url_for('home'))
            else:
                return "Incorrect Username or Password"
        except:
            return "Incorrect Username or Password"


# REGISTER PAGE
@app.route('/register', methods=['GET', 'POST'])
def register():
    """Register Form"""
    if request.method == 'GET':
        # NEED THIS HTML
        return render_template('register.html')

    else if request.method == 'POST':
        name = request.form['username']
        passw = request.form['password']
        first = request.form['firstName']
        last = request.form['lastName']

        try:
            user_search = session.query(User).filter_by(username=name).first()
            if user_search is not None:
                return "username is already in use, please enter another"
            else:
                new_user = User(first_name=first,
                                  last_name=last,
                                  login=name,
                                  password=passw
                                  )
                session.add(new_user)
                session.commit()
                return redirect(url_for('login'))
        except:
            return "Incorrect Username or Password"


@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


#create remove update delete contacts



# TODO: add correct HTML here
#
# landing page that will display all the contacts for a specific user
# This function will operate on the Read operation.
@app.route('/')
@app.route('/user/<int:user_id>/', )
def showContactsForUser(user_id):
    contacts = session.query(Contact).filter_by(user_id=user_id)

    # send the contacts with the html
    # so the index.html template can display the contacts
    return render_template('index.html', contacts=contacts)

# should we pass in a user_id here?
# This will let us Create a new contact and save it in our contacts database
@app.route('/user/<int:user_id>/add_contact/', methods=['GET', 'POST'])
def newContact(user_id):
    if request.method == 'POST':
        new_contact = Contact(first_name=request.form['FirstName'],
                          last_name=request.form['lastName'],
                          phone=request.form['phone'],
                          email=request.form['email'],
                          user_id = user_id)

        session.add(new_contact)
        session.commit()
        # do we need to pass our user_id here. showing contacts after we add one
        return redirect(url_for('showContactsForUser'))
    else:
        # if GET go to the add_contact html, if template, send info here
        return render_template('add_contact.html')


# Do we even need this routing or do we just need the API below?
@app.route("/user/<int:user_id>/<int:contact_id>", methods=['GET', 'POST'])
def editBook(user_id, contact_id):
    edited_contact = session.query(Book).filter_by(id=contact_id).one()
    if request.method == 'POST':
        if request.form['name']:
            editedBook.title = request.form['name']
            return redirect(url_for('showBooks'))
    else:
        return render_template('editBook.html', book=editedBook)




# do we need something like this for contacts or is the delete in API sufficient?
# This will let us Delete our book
@app.route('/books/<int:book_id>/delete/', methods=['GET', 'POST'])
def deleteBook(book_id):
    bookToDelete = session.query(Book).filter_by(id=book_id).one()
    if request.method == 'POST':
        session.delete(bookToDelete)
        session.commit()
        return redirect(url_for('showBooks', book_id=book_id))
    else:
        return render_template('deleteBook.html', book=bookToDelete)


"""
api functions
"""
from flask import jsonify


# gets all contacts for a specific user_id
def get_contacts(user_id):
    contacts = session.query(Contacts).filter_by(user_id=user_id)
    return jsonify(contacts=[c.serialize for c in contacts])

# get a single contact by its id number
def get_contact(contact_id):
    contact = session.query(Contacts).filter_by(id=contact_id).one()
    return jsonify(contact=contact.serialize)

# create a new contact given all information
def create_new_contact(user_id, first_name, last_name, phone, email):
    added_contact = Contact(first_name=first_name, last_name=last_name,
                            phone=phone, email=email, user_id=user_id)
    session.add(added_contact)
    session.commit()
    return jsonify(Contact=added_contact.serialize)

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



# using the args of the request,
@app.route('/')
@app.route('/contactsApi', methods=['GET', 'POST'])
def contactsFunction():
    if request.method == 'GET':
        return get_contacts(request.args.get('user_id', ''))
    elif request.method == 'POST':
        first = request.args.get('first_name', '')
        last = request.args.get('last_name', '')
        phone = request.args.get('phone', '')
        email = request.args.get('email', '')
        user = request.args.get('user_id', '')
        return create_new_contact(first, last, phone, email, user)



# get a specific contact by contact ID
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


if __name__ == '__main__':
    app.debug = True
    app.run(host='0.0.0.0', port=4996)
