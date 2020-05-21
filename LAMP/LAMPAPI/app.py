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


@app.route('/', methods=['GET', 'POST'])
def home():
    """ Session control"""
    if not session.get('logged_in'):
        return render_template('index.html')
    else:
        if request.method == 'POST':
            username = getname(request.form['username'])
            return render_template('index.html', data=getfollowedby(username))
        return render_template('index.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login Form"""
    if request.method == 'GET':
        return render_template('login.html')
    else:
        name = request.form['username']
        passw = request.form['password']
        try:
            data = session.query(User).filter_by(username=name, password=passw).first()
            if data is not None:
                session['logged_in'] = True
                return redirect(url_for('home'))
            else:
                return "Incorrect Username or Password"
        except:
            return "Dont Login"










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
    return render_template('index.html', contacts=contacts)


# This will let us Create a new book and save it in our database
@app.route('/books/new/', methods=['GET', 'POST'])
def newBook():
    if request.method == 'POST':
        newBook = Book(title=request.form['name'],
                       author=request.form['author'],
                       genre=request.form['genre'])
        session.add(newBook)
        session.commit()
        return redirect(url_for('showBooks'))
    else:
        return render_template('newBook.html')


# This will let us Update our books and save it in our database
@app.route("/books/<int:book_id>/edit/", methods=['GET', 'POST'])
def editBook(book_id):
    editedBook = session.query(Book).filter_by(id=book_id).one()
    if request.method == 'POST':
        if request.form['name']:
            editedBook.title = request.form['name']
            return redirect(url_for('showBooks'))
    else:
        return render_template('editBook.html', book=editedBook)


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
