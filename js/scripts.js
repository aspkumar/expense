var noteIn = $("#note");
var expenseIn = $("#expense");
var incomeIn = $("#income");
var dateIn = $("#datepicker");

$(function() {
	// var env = "PROD"; //DEV-TEST-PROD
	// if (Modernizr.localstorage) {
	// 	// window.localStorage is available!
	// 	if (env=="DEV" || env=="TEST") { }
	// } else {
	// 	// no native support for HTML5 storage :(
	// 	if (env=="DEV" || env=="TEST") alert("localstorage is not available!");
	// }

	if (!Modernizr.localstorage) {
		$(".hero-unit").before('<div id="error" class="row well span6 offset2">Sorry! Your browser doesn\'t support\
			the LocalStorage spec. Please try this site in a more forward thinking browser like Google Chrome \
			or Mozilla Firefox.</div><br/><br/>');
	}

	// Apply datepicker to DOM
	$( "#datepicker" ).datepicker();

	// Responsive dropdown for input		
	$("#note").on("click", function() {
		if ($(window).width() < 768) {
			$(".slideBlock").css('display', 'inline');
		}
	});

	// Initialize 0-key for balance
	if (localStorage.length <= 1) {
		localStorage.setItem("balance",0);
	}

	// Load data from local storage on page load
	if (localStorage.length) {
		printTable();
	}

	// Print errors if applicable and repop form entries
	if (localStorage.getItem("error-active") == 1) {
		//alert("anon - error-active: "+localStorage.getItem("error-active"));
		printErrors();
	}

	// Save form data
	$("#commit").click(function() {
		if ($(window).width() < 768) {
			$(".slideBlock").css('display', 'none');
		}
		validate();
	});
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
	if (( isNonblank(expenseIn.val()) && !isNonblank(incomeIn.val()) ) || ( !isNonblank(expenseIn.val()) 
		&& isNonblank(incomeIn.val()) )) {
		return true;
	}
	return false;
}

// Check if date is MM/DD/YYYY
function isGoodDate(dt){
	var reGoodDate = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/;
	if (dt == "") {
		return false;
	}
	return reGoodDate.test(dt);
}

// Validate form inputs
function validate() {
	error = '';
	console.log("validating");
	console.log("note: " + noteIn.val());
	console.log("expense: " + expenseIn.val());
	console.log("income: " + incomeIn.val());
	console.log("date: " + dateIn.val());

	console.log("note non-blank: " + isNonblank(noteIn.val()));
	if (!isNonblank(noteIn.val())) {
		error += '<li>Item description cannot be blank.</li>';
	}
	console.log("income or expense (not both): " + isExpOrInc());
	console.log("expense is currency: " + isCurrency(expenseIn.val()));
	console.log("income is currency: " + isCurrency(incomeIn.val()));
	if (isNonblank(expenseIn.val()) && isNonblank(incomeIn.val())) {
		error += '<li>Item cannot be an expense and an income.</li>';
	} else if (!isNonblank(expenseIn.val()) && !isNonblank(incomeIn.val())) {
		error += '<li>Item must be an expense or an income.</li>';
	} else if (!isNonblank(expenseIn.val()) && !isCurrency(incomeIn.val())) {
		error += '<li>Income field must be a currency: either a whole number or a number with 2 decimal places.</li>';
	} else if (!isNonblank(incomeIn.val()) && !isCurrency(expenseIn.val())) {
		error += '<li>Expense field must be a currency: either a whole number or a number with 2 decimal places.</li>';
	}
	console.log("dt is in mm/dd/yyyy format: " + isGoodDate(dateIn.val()));
	if (!isGoodDate(dateIn.val())) {
		error += '<li>Date must be in MM/DD/YYYY format.</li>';
	}

	if( isNonblank(noteIn.val()) && isExpOrInc() && ( isCurrency(expenseIn.val()) || isCurrency(incomeIn.val()) ) && 
		isGoodDate(dateIn.val()) ) {
		console.log("everything is in working order!");
		localStorage.setItem("error-active", 0);
		localStorage.setItem("error-note", null);
		localStorage.setItem("error-expense", null);
		localStorage.setItem("error-income", null);
		localStorage.setItem("error-date", null);
		save();
	} else {
		console.log("there is an error!");
		localStorage.setItem("error", '<ul>'+error+'</ul>');
		localStorage.setItem("error-active", 1);
		localStorage.setItem("error-note", noteIn.val());
		localStorage.setItem("error-expense", expenseIn.val());
		localStorage.setItem("error-income", incomeIn.val());
		localStorage.setItem("error-date", dateIn.val());
		printErrors();
		// repopulate form with previous entries
	}
}

// Save form input to localStorage
function save() {
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".active",true);
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".note",noteIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".expense",expenseIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".income",incomeIn.val());
	console.log("setting date to: " + dateIn.val());

	localStorage.setItem(Math.floor((localStorage.length-3)/5)+".date",dateIn.val());

	oldBalance = parseFloat(localStorage.getItem("balance"));
	newItem = isCurrency(expenseIn.val()) ? -expenseIn.val() : incomeIn.val();
	newBalance = (oldBalance) + parseFloat(newItem);

	console.log("oldBalance: "+ (oldBalance));
	console.log("newItem: "+ parseFloat(newItem));
	console.log("newBalance: "+ newBalance);
	
	localStorage.setItem("balance", newBalance);
	printTable();
}

// Remove particular entry
function remove(cursor) {
	// Stays in memory with the option to create an undo option
	localStorage.setItem(cursor + ".active", false);

	oldBalance = localStorage.getItem("balance");
	oldItem = "";
	if (isCurrency(localStorage.getItem(cursor + ".income"))) {
		oldItem = localStorage.getItem(cursor + ".income");
	} else {
		oldItem = -localStorage.getItem(cursor + ".expense");
	}
	newBalance = oldBalance - parseFloat(oldItem);
	localStorage.setItem("balance", newBalance);
	printTable();
}

function clear() {
	localStorage.clear();
	localStorage.setItem("balance", 0);
	localStorage.setItem("error-active", 0);
	printTable();
	$("#note").val("");
	$("#expense").val("");
	$("#income").val("");
	$("#datepicker").val("");
	if ($("#error").length == 1) {
		$("#error").hide();
	}
}

function printTable() {
	printBalance();
	htmlData = '';
	for (var i = 0; i < (localStorage.length-1)/5; i++) {
		if (localStorage.getItem(i+".active") == "true") {
			if (isCurrency( localStorage.getItem(i+".expense") )) {
				htmlData += '<tr><td>'+localStorage.getItem(i+".note")+'</td>\
				<td>'+formatMoney(parseFloat(localStorage.getItem(i+".expense")))+'</td><td></td>\
				<td>'+localStorage.getItem(i+".date")+'</td>\
				<td><button onClick="javsacript: remove('+i+')" class="btn btn-danger btn-xsmall">\
				<i class="icon-trash icon-white"></i></button></td></tr>';
			} else {
			 	htmlData += '<tr><td>'+localStorage.getItem(i+".note")+'</td>\
			 	<td></td><td>'+formatMoney(parseFloat(localStorage.getItem(i+".income")))+'</td>\
			 	<td>'+localStorage.getItem(i+".date")+'</td>\
			 	<td><button onClick="javsacript: remove('+i+')" class="btn btn-danger btn-xsmall">\
			 	<i class="icon-trash icon-white"></i></button></td></tr>';	
			}
		}
	}
	$(".data").html(htmlData);
}

/**** Currency reg ex for balance ****/
// Extend the default Number object with a formatMoney() method:
// usage: formatMoney(amount, decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
// defaults: (N/A, 2, "$", ",", ".")
function formatMoney(amount, places, symbol, thousand, decimal) {
	places = !isNaN(places = Math.abs(places)) ? places : 2;
	symbol = symbol !== undefined ? symbol : "$";
	thousand = thousand || ",";
	decimal = decimal || ".";
	var number = Math.round(amount*Math.pow(10,2))/Math.pow(10,2), // account for float inaccuracies
		negativeL = number < 0 ? "(" : "",
		negativeR = number < 0 ? ")" : "",
		i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		j = (j = i.length) > 3 ? j % 3 : 0;
	return negativeL + symbol + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) +
		(places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "") + negativeR;
}

function printBalance() {
	$("#balance").html('Balance: ' + formatMoney(parseInt(localStorage.getItem("balance"))));
}

function printErrors() {
	console.log("new error - adding <div> with <ul>");
	//alert("printErrors");
	if ($("#error").length == 0) {
		$("#input").after('<div id="error" class="row well span6 offset2"><ul>'+localStorage.getItem("error")+'</ul></div>');
	} else {
		$("#error").html('<ul>'+localStorage.getItem("error")+'</ul>');
	}
	if (localStorage.getItem("error-note") != null) {
		$("#note").val(localStorage.getItem("error-note"));
	}
	if (localStorage.getItem("error-expense") != null) {
		$("#expense").val(localStorage.getItem("error-expense"));
	}
	if (localStorage.getItem("error-income") != null) {
		$("#income").val(localStorage.getItem("error-income"));
	}
	if (localStorage.getItem("error-date") != null) {
		$("#datepicker").val(localStorage.getItem("error-date"));
	}
}