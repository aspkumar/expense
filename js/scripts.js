var note, expense, income, date;
var balanceF = "";

var noteIn = $("#note");
var expenseIn = $("#expense");
var	incomeIn = $("#income");
var	dateIn = $("#datepicker");

/**** Currency reg ex for balance ****/
	// Extend the default Number object with a formatMoney() method:
	// usage: someVar.formatMoney(decimalPlaces, symbol, thousandsSeparator, decimalSeparator)
	// defaults: (2, "$", ",", ".")
	Number.prototype.formatMoney = function(places, symbol, thousand, decimal) {
		places = !isNaN(places = Math.abs(places)) ? places : 2;
		symbol = symbol !== undefined ? symbol : "$";
		thousand = thousand || ",";
		decimal = decimal || ".";
		var number = this, 
		    negative = number < 0 ? "-" : "",
		    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
		    j = (j = i.length) > 3 ? j % 3 : 0;
		return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
	};

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

		/**** Initialize 0-key for balance ****/
		if (localStorage.length <= 1) {
			// alert("resetting balance!")
			localStorage.setItem("balance",0);
			$("#balance").html("Balance: $0");
			//$("#balance").html("Balance bad: "+localStorage.getItem("balance"));
		}
		if (localStorage.length > 1) {
			balanceF = parseFloat(localStorage.getItem("balance")).formatMoney();
			//alert(balanceF);
			$("#balance").html("Balance: "+ balanceF);
		}

		/**** Save form data ****/
		$("#commit").click(function() {
		    if ($(window).width() < 768)
				$(".slideBlock").css('display', 'none');
			validate();
		});

		/**** Load data from local storage on page load ****/
		if (localStorage.length) {
			htmlData = "";
			for (var i = 0; i < (localStorage.length-1)/5; i++) {
				// alert(localStorage.getItem(i+".note"));
				// alert(localStorage.getItem(i+".expense"));
				// alert(localStorage.getItem(i+".income"));
				// alert(localStorage.getItem(i+".date"));
				//alert(localStorage.getItem(i+".active"));
				if (localStorage.getItem(i+".active") == "true")
           			htmlData += "<tr><td>"+i+"</td><td>"+localStorage.getItem(i+".note")+"</td><td>"+localStorage.getItem(i+".expense")+"</td><td>"+localStorage.getItem(i+".income")+"</td><td>"+localStorage.getItem(i+".date")+"</td><td><button onClick=\"javsacript: remove("+i+")\" class=\"btn btn-danger btn-xsmall\"><i class=\"icon-trash icon-white\"></i></button></td></tr>";
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

// Check if date is MM/DD/YYYY
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
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".active",true);
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".note",noteIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".expense",expenseIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".income",incomeIn.val());
	localStorage.setItem(Math.floor((localStorage.length-1)/5)+".date",dateIn.val());

	oldBalance = parseFloat(localStorage.getItem("balance"));
	newItem = 0;
	if (isCurrency(expenseIn.val()))
		newItem = -expenseIn.val();
	else
		newItem = incomeIn.val();
	newBalance = (oldBalance) + parseFloat(newItem);

	console.log("oldBalance: "+ (oldBalance));
	console.log("newItem: "+ parseFloat(newItem));

	console.log("newBalance: "+ newBalance);
	localStorage.setItem("balance", newBalance);

	//alert( newBalance.formatMoney() );
	balanceF = newBalance.formatMoney();
	$("#balance").html("Balance: " + newBalance.formatMoney());

	htmlData = "";
			for (var i = 0; i < (localStorage.length-1)/5; i++) {
				// alert(localStorage.getItem(i+".note"));
				// alert(localStorage.getItem(i+".expense"));
				// alert(localStorage.getItem(i+".income"));
				// alert(localStorage.getItem(i+".date"));
				//alert(localStorage.getItem(i+".active"));
				if (localStorage.getItem(i+".active") == "true")
           			htmlData += "<tr><td>"+i+"</td><td>"+localStorage.getItem(i+".note")+"</td><td>"+localStorage.getItem(i+".expense")+"</td><td>"+localStorage.getItem(i+".income")+"</td><td>"+localStorage.getItem(i+".date")+"</td><td><button onClick=\"javsacript: remove("+i+")\" class=\"btn btn-danger btn-xsmall\"><i class=\"icon-trash icon-white\"></i></button></td></tr>";
      		}
      		$(".data").html(htmlData);
}

function remove(cursor) {
	// alert("remove "+cursor);
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
	$("#balance").html("Balance: " + newBalance.formatMoney());

	htmlData = "";
	for (var i = 0; i < (localStorage.length-1)/5; i++) {
		// alert(localStorage.getItem(i+".note"));
		// alert(localStorage.getItem(i+".expense"));
		// alert(localStorage.getItem(i+".income"));
		// alert(localStorage.getItem(i+".date"));
		// alert(localStorage.getItem(i+".active"));
		if (localStorage.getItem(i+".active") == "true")
   			htmlData += "<tr><td>"+i+"</td><td>"+localStorage.getItem(i+".note")+"</td><td>"+localStorage.getItem(i+".expense")+"</td><td>"+localStorage.getItem(i+".income")+"</td><td>"+localStorage.getItem(i+".date")+"</td><td><button onClick=\"javsacript: remove("+i+")\" class=\"btn btn-danger btn-xsmall\"><i class=\"icon-trash icon-white\"></i></button></td></tr>";
		}
	$(".data").html(htmlData);
}