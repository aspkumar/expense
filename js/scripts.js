var note, expense, income, date;

var noteIn = $("#note");
var expenseIn = $("#expense");
var	incomeIn = $("#income");
var	dateIn = $("#datepicker");

$(function() {
		var env = "PROD"; //DEV-TEST-PROD

		$( "#datepicker" ).datepicker({

		});

		if (Modernizr.localstorage) {
		  // window.localStorage is available!
		  if (env=="DEV" || env=="TEST") {
		  	
			}
		} else {
		  // no native support for HTML5 storage :(
		  // maybe try dojox.storage or a third-party solution
		  if (env=="DEV" || env=="TEST") alert("localstorage is not available!");
		}

		/**** Responsive dropdown for input ****/		
		$("#note").on("click", function() {
			if ($(window).width() < 768)
				$(".slideBlock").css('display', 'inline');
		});

		/**** Save form data ****/
		$("#commit").click(function() {
		    if ($(window).width() < 768)
				$(".slideBlock").css('display', 'none');
			validate();
		});

		/**** Initialize 0-key for balance ****/
		if (localStorage.length == 0)
			localStorage.setItem("balance",0);
		$("#balance").html("Balance: $"+localStorage.getItem("balance"));

		/**** Load data from local storage on page load ****/
		if (localStorage.length) {
			htmlData = "";
			for (var i = 0; i < (localStorage.length-1)/4; i++) {
				// alert(localStorage.getItem(i+".note"));
				// alert(localStorage.getItem(i+".expense"));
				// alert(localStorage.getItem(i+".income"));
				// alert(localStorage.getItem(i+".date"));
           		htmlData += "<tr><td>"+i+"</td><td>"+localStorage.getItem(i+".note")+"</td><td>"+localStorage.getItem(i+".expense")+"</td><td>"+localStorage.getItem(i+".income")+"</td><td>"+localStorage.getItem(i+".date")+"</td><td></td></tr>";
      		}
      		$(".data").html(htmlData);
		}
});

// Check if string is currency
var isCurrency_re    = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;
function isCurrency (s) {
		return String(s).search (isCurrency_re) != -1
}

// Check if note is non-blank
var isNonblank_re    = /\S/;
function isNonblank (s) {
	return String (s).search (isNonblank_re) != -1
}

// Check if either income or expense
function isExpOrInc () {
	if (( isNonblank(expenseIn.val()) && !isNonblank(incomeIn.val()) ) || 
		( !isNonblank(expenseIn.val()) && isNonblank(incomeIn.val()) ))
			return true;
	else
		return false;
}

// Checck if date is MM/DD/YYYY
function isGoodDate(dt){
	var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
	return reGoodDate.test(dt);
}

function validate() {
	console.log("validating");

	console.log("note: " + noteIn.val());
	console.log("expense: " + expenseIn.val());
	console.log("income: " + incomeIn.val());
	console.log("date: " + dateIn.val());

	console.log("note non-blank: " + isNonblank(noteIn.val()));
	console.log("expense is currency: " + isCurrency(expenseIn.val()));
	console.log("income is currency: " + isCurrency(incomeIn.val()));
	console.log("income or expense (not both): " + isExpOrInc());
	console.log("dt is in mm/dd/yyyy format: " + isGoodDate(dateIn.val()));

	if( isNonblank(noteIn.val()) && isExpOrInc() && ( isCurrency(expenseIn.val()) || isCurrency(incomeIn.val()) ) && isGoodDate(dateIn.val()) ) {
		console.log("everything is in working order!");
		save();
	} else {
		console.log("there is an error!");
		// repopulate form with previous entries
	}
}

function save() {
	localStorage.setItem(Math.floor((localStorage.length-1)/4)+".note",noteIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/4)+".expense",expenseIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/4)+".income",incomeIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/4)+".date",dateIn.val());

	oldBalance = parseInt(localStorage.getItem("balance"));
	newItem = 0;
	if (isCurrency(expenseIn.val()))
		newItem = -expenseIn.val();
	else
		newItem = incomeIn.val();
	newBalance = parseFloat(oldBalance) + parseFloat(newItem);
	console.log(newBalance);
	localStorage.setItem("balance", newBalance);
	$("#balance").html("Balance: $"+localStorage.getItem("balance"));
}