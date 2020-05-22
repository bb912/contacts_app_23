/* Main JavaScript code for contact manager web application. Note that a majority of the
  code is similar to the sample given in the LAMP stack demo. Most changes were made to
  add() and search() functions. Additional functions need to be created to work with
  addContact() function.

  TO-DO:
  1. Update Id names each time document.getElementById() is called to match html code.
  2. Edit addContact() function and add other functions to check validity of user input.
  3. Edit searchContact() function that enables search through names, phones, and emails
     by a given key.
  4. Add comments to improve readability of the code.
  5. Connect to API Endpoints.

  Last updated: 5/22/2020, 1:10 PM
*/

var urlBase = 'https://cop433123.us/';
var extension = 'py';

var userID = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
  userId = 0;
	firstName = "";
	lastName = "";

  // Retrieving login information.
	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

  // Sets the innerHTML property to an empty string.
	document.getElementById("loginResult").innerHTML = "";
  var jsonPayload = '{"login" : "' + login + '", "password" : "' + password + '"}';
  var url = urlBase + '/Login.' + extension;

  // Transferring data from front end to API.
	var xhr = new XMLHttpRequest();

  // Since false, any xhr.send() calls do not return until a response is achieved.
	xhr.open("POST", url, false);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  // Checking if the user entered a valid user/password combination.
  try
	{
		xhr.send(jsonPayload);

    // JSON.parse() converts a string to an object
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;

		if(userId < 1)
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;
		saveCookie();

    // change to appropriate filename
		window.location.href = "contactApp.html";
	}

	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
  var minutes = 20;
  var date = new Date();
  date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	var data = document.cookie;

  // splits and token store the firstName, lastName, userId in arrays.
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
    // Removing whitespace.
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}

  // Returns to homepage. Otherwise successful login.
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
  // prevents webpage from being cached
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";

  // returns user to main page
	window.location.href = "index.html";
}

// The following functions include helper functions to validate user inputs.
// Note that these still need to be implemented into the addContact() and
// searchContact() functions.

// Checks if a value is not empty, returns false if size 0, null, or undefined.
function isNotEmpty(value)
{
  if(value == null || typeof value = 'undefined') return false;
  return (value.length > 0);
}

// Checks if the user entered a valid email.
function checkEmail(email)
{
  // A regex used to check for a valid email address.
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
function checkName(name)
{
  if(name.length < 1)
  {
    return false;
  }
  return true;
}

function checkPhone(phone)
{
  // A regex used to check for a valid phone number.
  // Includes phone numbers in the format:
  // 123-456-7890
  // 123.456.7890
  // 123 456 7890
  var re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
}
// end of helper functions

function addContact()
{
  var flag = false;

  // Checks validity of user input before sending JSON payload.
  while(flag === false)
  {
    var newFirst = document.getElementById("firstText").value();
    var newLast = document.getElementById("lastText").value();
    var newEmail = document.getElementById("emailText").value();
    var newPhone = document.getElementById("phoneText").value();
    if(!checkName(newFirst))
    {
      document.getElementById("addContactResult").innerHTML = "First name cannot be empty";
    }
    else if(!checkName(newLast))
    {
      document.getElementById("addContactResult").innerHTML = "Last name cannot be empty";
    }
    else if(!checkEmail(newEmail))
    {
      document.getElementById("addContactResult").innerHTML = "Invalid email address";
    }
    else if(!checkPhone(newPhone))
    {
      document.getElementById("addContactResult").innerHTML = "Invalid phone number";
    }
    else
    {
      flag = true;
    }
  }

  var jsonPayload = '{"firstName" : "' + newFirst + '", "lastName" : "' + newLast + '", "email" : "' + newEmail + '","phone" : "' + newPhone + '","userId" : ' + userId + '}';

  // Edit name to match with API python file.
  var url = urlBase + '/AddContact.' + extension;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}

}

function searchContact()
{
  var srch = document.getElementById("searchText").value;
  document.getElementById("contactSearchResult").innerHTML = "";

  var contactList = "";
  var jsonPayload = '{"search" : "' + srch + '","userId" : ' + userId + '}';
	var url = urlBase + '/SearchContacts.' + extension;

  var xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				var jsonObject = JSON.parse( xhr.responseText );

				for( var i = 0; i < jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}

				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}

}
