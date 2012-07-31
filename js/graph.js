$(function() {
	$("#graphBtn").on("click", function() {
		$('#graphs').modal('toggle');
		var cosPoints = []; 
		  for (var i=0; i<2*Math.PI; i+=0.1){ 
		     cosPoints.push([i, Math.cos(i)]); 
		  } 
		  var plot1 = $.jqplot('chart', [cosPoints], {  
		      series:[{showMarker:false}],
		      axes:{
		        xaxis:{
		          label:'Angle (radians)'
		        },
		        yaxis:{
		          label:'Cosine'
		        }
		      }
		  });
		  
	});
});