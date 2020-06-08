/* Main JavaScript code for contact manager web application. Note that a majority of the
  code is similar to the sample given in the LAMP stack demo. Most changes were made to
  add() and search() functions. Additional functions created to work with
  addContact() function.

  TO-DO:
  1. Update Id names each time document.getElementById() is called to match html code.
  2. Connect to API Endpoints.

  Last updated: 5/28/2020, 12:25 PM
*/
/*
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
*/

var urlBase = 'http://198.12.250.5:4996';

var userId = 0;
var firstName = "";
var lastName = "";


function signUp() {
  var first = document.getElementById("firstText").value;
  var last = document.getElementById("lastText").value;
  var user = document.getElementById("username").value;
  var pass = document.getElementById("password").value;

  var jsonPayload = JSON.stringify({FirstName: first, LastName: last, Login:user,Password:pass });
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  try{
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if (this.status === 0 || (this.status >= 200 && this.status < 400)){
          document.getElementById("signupmessage").innerHTML = "Account successfully created";
        }
        else{
          document.getElementById("signupmessage").innerHTML = "Error creating account";
        }
      }
    });
  }
  catch(err)
  {
    document.getElementById("signupmessage").innerHTML = err.message;
  }
  
  xhr.open("POST", urlBase + "/userApi");
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  xhr.send(jsonPayload);
}

// Logging in existing user. Returns to main page if request unsuccessful.
function doLogin(){
  userId = 0;
	firstName = "";
  lastName = "";

  var login = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;

  var jsonPayload = JSON.stringify({Login: login, Password: password});
  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  try{
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if (this.status === 0 || (this.status >= 200 && this.status < 400)){
          var jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.User.ID;
          saveCookie();
          window.location.href = "html2.html";
        }
        else{
          document.getElementById("loginmessage").innerHTML = "Error logging in";
        }
      }
    });
  }
  catch(err)
  {
    document.getElementById("loginmessage").innerHTML = err.message;
  }
  
  xhr.open("POST", urlBase + "/userApi/login");
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  alert ("jsonPayload: "+ jsonPayload);
  xhr.send(jsonPayload);
}

/*
function doLogin2(){
  userId = 0;
	firstName = "";
	lastName = "";
  var login = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;
  //alert("login " +login+ "\npassword " +password);
  var data = new FormData();
  data.append("Login", login);
  data.append("Password", password);

  var xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  try{
    xhr.addEventListener("readystatechange", function() {
      if(this.readyState === 4) {
        if (this.status === 0 || (this.status >= 200 && this.status < 400)){
          var jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.User.ID;
          //alert(userId);
          saveCookie();
          //alert("Found cookie " + getCookie());
          window.location.href = "html2.html";
        }
        else{
          document.getElementById("loginmessage").innerHTML = "Error logging in";
        }
      }
    });
  }
  catch(err)
  {
    document.getElementById("loginmessage").innerHTML = err.message;
  }

  xhr.open("GET", urlBase + "/userApi/login");
  //xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  alert("login " +login+ "\npassword " +password + "\ndata "+data);
  xhr.send(data);
}


function doLogin3()
{
  //alert("doLogin alert");
	userId = 0;
	firstName = "";
	lastName = "";

  // Retrieving login information. Update IDs to match html.
  var login = document.getElementById("loginName").value;
  var password = document.getElementById("loginPassword").value;

  //document.getElementById("loginResult").innerHTML = "";
  var jsonPayload = '{"Login" : "' + login + '", "Password" : "' + password + '"}';
  var url = urlBase + '/userApi/login';//?Login='+ login + "&Password=" + password;
  
  var xhr = new XMLHttpRequest();
  // Since false, any xhr.send() calls do not return until a response is achieved.
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
  {
    xhr.onreadystatechange = function () {
      //alert("xhr.readyState = " + xhr.readyState + "\nxhr.status = " + xhr.status + "\nXMLHttpRequest.DONE = " + XMLHttpRequest.DONE);
			  if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400))
			  {
          var jsonObject = JSON.parse(xhr.responseText);
          userId = jsonObject.User.ID;
          //alert(userId);
          saveCookie();
          //alert("Found cookie " + getCookie());
          window.location.href = "html2.html";
        }
        else{
          document.getElementById("loginmessage").innerHTML = "Error logging in";
        }
    };
    xhr.send(jsonPayload);
    //alert("sent.\nxhr.readyState = " + xhr.readyState + "\nxhr.status = " + xhr.status);
  }
  catch(err)
  {
    document.getElementById("loginmessage").innerHTML = err.message;
  }

}
*/
function saveCookie()
{
  var minutes = 20;
  var date = new Date();
  date.setTime(date.getTime()+(minutes*60*1000));
	document.cookie = "userId=" + userId + ";expires=" + date.toGMTString() + ";path=/";
}

function getCookie() {
  var name = "userId=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
/*
function readCookie()
{
	userId = -1;
	var data = document.cookie;

  // splits/token store the firstName, lastName, userId in arrays.
	var splits = data.split(";");
	for(var i = 0; i < splits.length; i++)
	{
    // Removing whitespace.
		var thisOne = splits[i].trim();
		var tokens = thisOne.split("=");
		if (tokens[0] == "firstName")
		{
			firstName = tokens[1];
		}
		else if(tokens[0] == "lastName")
		{
			lastName = tokens[1];
		}
		else if(tokens[0] == "userId")
		{
			userId = parseInt(tokens[1].trim());
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
}*/

function doLogout()
{
	userId = -1;
	firstName = "";
	lastName = "";
  alert("clearing " + document.cookie);
  // Prevents webpage from being cached
  document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  //document.cookie = "userId=; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  alert("cleared " + document.cookie);

  // Returns user to main page. Change filename if necessary.
	window.location.href = "index.html";
}

// The following functions include helper functions to validate user inputs.
function checkEmail(email)
{
  // A regex used to check for a valid email address.
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function checkName(name)
{
  var re = /^[a-zA-Z]+ [a-zA-Z]+$/;
  if(name.length < 1 || !re.test(name))
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
  return re.test(phone);
}
// end of helper functions

/*
  // Checks validity of user input before sending JSON payload.
    if(!checkEmail(newEmail))
    {
      //document.getElementById("addContactResult").innerHTML = "Invalid email";
      return;
    }
    else if(!checkPhone(newPhone))
    {
      //document.getElementById("addContactResult").innerHTML = "Invalid phone number";
      return;
    }
*/
function addContact()
{
  var userId = getCookie();
  var newFirst = document.getElementById("firstText").value;
  var newLast = document.getElementById("lastText").value;
  var newEmail = document.getElementById("emailText").value;
  var newPhone = document.getElementById("phoneText").value;

  var jsonPayload = JSON.stringify({FirstName: newFirst, LastName: newLast, Email: newEmail, PhoneNumber: newPhone, UserID:userId});
  var xhr = new XMLHttpRequest();
  //xhr.withCredentials = true;
  try{
		xhr.addEventListener("readystatechange", function(){
      if(this.readyState === 4) {
			  if (this.status === 0 || (this.status >= 200 && this.status < 400)){
          //document.getElementById("contactAddResult").innerHTML = "Contact has been added";
        }
        else{
          //failed to add contact
        }
      }
    });
	}
	catch(err)
	{
		//document.getElementById("contactAddResult").innerHTML = err.message;
  }
  xhr.open("POST", urlBase + "/contactsApi");
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  alert("jsonPayload: " + jsonPayload);
  xhr.send(jsonPayload);
}


// update jsonPayload to match API
function deleteContact()
{
  var del = document.getElementById("deleteText").value;
  var jsonPayload = '{"delete" : "' + del + '","userId" : ' + userId + '}';
  var url = urlBase + '/contactsApi/' ;

  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

  try
  {
    xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				document.getElementById("contactDeleteResult").innerHTML = "Contact successfully deleted";
				var jsonObject = JSON.parse( xhr.responseText );
			}
		};
    xhr.send(jsonPayload);
  }
  catch(err)
  {
    document.getElementById("contactDeleteResult").innerHTML = err.message;
  }
}

function createArray(json)
{
  var allNames = [json.FirstName].join(" ");
  return allNames;
}

// Creates list of contacts using array of names from JSON object. 
// Not sure if the list should already be created by html, or here.
function createList(json)
{
  var myObj = json.map(createArray);
  // Id is the same as in search() function.
  for(var i = 0; i < myObj.length; i++)
  {
    var node = document.createElement("li");
    var textnode = document.createTextNode(myObj[i]);
    node.appendChild(textnode);
    document.getElementById('contactUL').appendChild(node);
  }
}

/*<span class="custom-checkbox">
									<input type="checkbox" id="checkbox1" name="options[]" value="1">
									<label for="checkbox1"></label>
								</span> */
function insertNewRecord(data) {
  alert(data.FirstName);
  var table = document.getElementById("contactstable").getElementsByTagName('tbody')[0];
  var newRow = table.insertRow(table.length);
  cell0 = newRow.insertCell(0);
  cell0.innerHTML = `<span class="custom-checkbox">
  <input type="checkbox" id="checkbox1" name="options[]" value="1">
  <label for="checkbox1"></label>
</span>`
  cell1 = newRow.insertCell(1);
  cell1.innerHTML = data.FirstName;
  cell2 = newRow.insertCell(2);
  cell2.innerHTML = data.LastName;
  cell3 = newRow.insertCell(3);
  cell3.innerHTML = data.Email;
  cell4 = newRow.insertCell(4);
  cell4.innerHTML = data.Phone;
  cell4 = newRow.insertCell(5);
  cell4.innerHTML = `<a href="#editContactModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Edit">&#xE254;</i></a>
  <a href="#deleteContactModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>`;
}

// General search function, uses <ul> to display results in unordered list.
// Function assumes that an <ul> already exists with some <li> elements.
/*
function search()
{
  var input, filter, ul, li, a, txtValue;
  input = document.getElementById("searchContact");
  filter = input.value.toLowerCase();

  ul = document.getElementById("contactUL");
  li = ul.getElementsByTagName("li");

  // Looping through all list items (contact names). Items that don't
  // match are hidden
  for (var i = 0; i < li.length; i++)
  {
    a = li[i].getElementsByTagName("a")[0];
    txtValue = a.textContent || a.innerText;

    // List items are only displayed if partial string exists in list.
    if (txtValue.toLowerCase().indexOf(filter) > -1)
    {
      li[i].style.display = "";
    }
    else
    {
      li[i].style.display = "none";
    }
  }
}*/

function searchContacts()
{
  //alert("searchContacts() alert!");
  //document.getElementById("contactSearchResult").innerHTML = "";
  var url = urlBase + "/contactsApi/search?UserID="+ getCookie() + "&SearchTerm="+ document.getElementById("searchField").value; 
  alert("url: " + url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  
	try
	{
    xhr.onreadystatechange = function()
    {
      if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400))
	    {
        var jsonObj = JSON.parse(xhr.responseText);
        var countKey = Object.keys(jsonObj).length;
        var i
        for (i = 0; i < countKey; i++){
          alert('b'+jsonObj["%d",i].Email);
          insertNewRecord(jsonObj["%d",i]);
        }
        
      }
    };
    xhr.send("");
	}
  catch(err)
  {
		//document.getElementById("contactSearchResult").innerHTML = err.message;
  }
  
  

}