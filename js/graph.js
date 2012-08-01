var pointsExp = [];
var pointsInc = [];
var graphTitle = "";

$(function() {
	$("#graphBtn").on("click", function() {
		$('#graphs').modal('toggle');
		populate1Month();
		chartIt();
	});
});

// monPoints.push([i, Math.cos(i)]);

function populate1Month() {
	var monExpPoints = [];
	var monIncPoints = [];
	var monExpCount = [];
	var monIncCount = [];
	graphTitle = "30 Days"
	for (var i = 0; i < (localStorage.length-1)/5; i++) {
		// plot if point is active
		if ( localStorage.getItem(i+".active") == "true" ) {
			date = new Date(localStorage.getItem(i+".date"));
			if ( localStorage.getItem(i+".expense") != "" ) {
				monExpPoints.push([date, parseFloat(localStorage.getItem(i+".expense"))]);
			} else {
				monIncPoints.push([date, parseFloat(localStorage.getItem(i+".income"))]);
			}
		}
	}
	pointsExp = monExpPoints;
	pointsInc = monIncPoints;
}

function populate3Month() {

}

function populate6Month() {

}

function populate12Month() {

}

function populateAll() {

}

function chartIt() {
	var plot1 = $.jqplot('chart', [pointsExp, pointsInc], {
		title: graphTitle,
		series:[{showMarker:true}],
		axes:{
			xaxis:{
				label:'Date',
				rendererOptions: { forceTickAt0: true, forceTickAt100: false },
				padMin: 0,
				renderer:$.jqplot.DateAxisRenderer,
				tickOptions:{
					formatString:'%b&nbsp;%#d'
				} 
			},
			yaxis:{
				tickOptions:{
					formatString:'$%.2f'
				}
			}
		},
		highlighter: {
			show: true,
			sizeAdjust: 7.5
		},
		seriesColors:['#C7754C', '#73C774'],
		seriesDefaults: {
			rendererOptions: {
				smooth: true,
				varyByColor: true
			}
		},
		canvasOverlay: {
			show: true,
			objects: [
				{horizontalLine: {
					name: 'pebbles',
					y: 0,
					lineWidth: 2,
					color: 'rgb(0, 0, 0)',
					shadow: false,
					lineCap: 'butt',
					xOffset: 0
				}}
			]
		}
	});
}