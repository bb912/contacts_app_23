/* Main JavaScript code for contact manager web application. Note that a majority of the code is similar
  to the sample given in the LAMP stack demo. Most changes were made to add() and search() functions.
  Additional functions need to be created to work with addContact() function.

  TO-DO: (updated 5/20/2020)
  1. add urlBase.
  2. edit addContact() function and add other functions to check validity of user input.
  3. edit searchContact function that enables search by first/last name.
  4. add comments to improve readability of the code.
  5. check md5.js and make adjustments to hashing functions.
*/

var urlBase = '';
var extension = 'py';

var userID = 0;
var firstName = "";
var lastName = "";

function doLogin()
{
  userId = 0;
	firstName = "";
	lastName = "";

	var login = document.getElementById("loginName").value;
	var password = document.getElementById("loginPassword").value;

  // Hashes user input using md5.js, see additional file within front end for
  // more details.
  var hash = md5( password );

  // "loginResult" must match id in HTML
	document.getElementById("loginResult").innerHTML = "";
  var jsonPayload = '{"login" : "' + login + '", "password" : "' + hash + '"}';
  var url = urlBase + '/Login.' + extension;

	var xhr = new XMLHttpRequest();
	xhr.open("POST", url, false);

	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  // A try/catch block to determine if entered input matches a valid user/password combination.
  try
	{
		xhr.send(jsonPayload);
		var jsonObject = JSON.parse( xhr.responseText );
		userId = jsonObject.id;

		if( userId < 1 )
		{
			document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
			return;
		}

		firstName = jsonObject.firstName;
		lastName = jsonObject.lastName;
		saveCookie();
		window.location.href = "contactApp.html"; // double check this
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
	var splits = data.split(",");
	for(var i = 0; i < splits.length; i++)
	{
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
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

// Checks if a value is not empty, returns false if size 0, null, or undefined.
function isNotEmpty(value)
{
  if(value == null || typeof value = 'undefined') return false;
  return (value.length > 0);
}

// Checks if the user entered a valid email.
//function isEmail(email)
//{

//}

function isValid()
{
  var flag = true;
  //Continue here...
  return flag;
}
function addContact()
{
  // All fields entered by user are grouped together.
  var newContact = {};
  document.addEventListener("DOMContentLoaded", function())
  {
    // Note that these ID names are just placeholders, they need to be adjusted later.
    newContact.firstName = document.getElementById('newFirst');
    newContact.lastName = document.getElementById('newLast');
    newContact.email = document.getElementById('newEmail');
    newContact.phone = document.getElementById('newPhone');
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
