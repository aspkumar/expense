$(function() {
		var env = "PROD"; //DEV-TEST-PROD

		$( "#datepicker" ).datepicker({

		});

		if (Modernizr.localstorage) {
		  // window.localStorage is available!
		  if (env=="DEV" || env=="TEST") {
		  	alert("localstorage is available!");
		  	localStorage.setItem('favoriteSite','Webmonkey.com');
		  	alert(localStorage.getItem('favoriteSite'));
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
		$("#commit").click(function() {
		    if ($(window).width() < 768)
				$(".slideBlock").css('display', 'none');
		});
});

