var pointsExp = [];
var pointsInc = [];
var graphTitle = "";
var plot1;

$(function() {
	$("#graphBtn").on("click", function() {
		$('#graphs').modal('toggle');
		populate();
		chartIt();
	});
	$('#graphs').on('hidden', function () {
		plot1.redraw();
	})
});

// monPoints.push([i, Math.cos(i)]);

function populate() {
	var monExpPoints = [];
	var monIncPoints = [];
	var monExpCount = [];
	var monIncCount = [];
	if ( localStorage.length >= 1 ) {
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
	} else {
		$('#chart').html('<h3>You have no data to graph!</h3>');
	}
	pointsExp = monExpPoints;
	pointsInc = monIncPoints;
}

function chartIt() {
	plot1 = $.jqplot('chart', [pointsExp, pointsInc], {
		series:[
			{
				label:'Expense',
				showLine:false
			},
			{
				label:'Income',
				showLine:false
			}
		],
		axes:{
			xaxis:{
				padMin: 0,
				renderer:$.jqplot.DateAxisRenderer,
				rendererOptions: { 
					forceTickAt0: true,
					tickInset: 0 
				},
				tickOptions:{
					formatString:'%b&nbsp;%#d'
				},
				tickRenderer: $.jqplot.CanvasAxisTickRenderer,
				tickOptions: {
					angle: -30
				}
			},
			yaxis:{
				renderer: $.jqplot.CanvasAxisRenderer,
				rendererOptions: {
					tickInset: 0 
				},
				tickOptions:{
					formatString:'$%.0f',
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
				varyByColor: true,
				animation: {
					show: true
				}
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
		},
		cursor:{
			show: true, 
			zoom: true
        }
	});
}