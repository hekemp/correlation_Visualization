var myCorrelation = 0.00;
var mySampleSize = 50;
var initialValue = 0.00;

var xValues = [];
var yValues = [];

// See https://github.com/tulip/multivariate-normal-js for MVN

function roundForDisplay(value, decimals){


		var returnNumber = ''+Number(Math.round(value+'e'+decimals)+'e-'+decimals)
		var returnNumberStart = '' + returnNumber;
    if(returnNumber=="NaN"){
      returnNumber = "0.0";
      returnNumberStart = returnNumber;
    }
		var returnNumberEnd = '';


		//if (your_string.indexOf('hello') > -1)
		if(returnNumber.indexOf('.') > -1){
			var returnNumberChunks = returnNumber.split('.');
			returnNumberStart = returnNumberChunks[0];
			returnNumberEnd = returnNumberChunks[1];
		}

		while(returnNumberEnd.length < decimals){
			returnNumberEnd+= '0';
		}

  	return returnNumberStart + '.' + returnNumberEnd;
	}

  function round(value, decimals) {
  		var returnNumber = Number(Math.round(value+'e'+decimals)+'e-'+decimals)
    	return returnNumber;
  	};

// window.MultivariateNormal.default instead of mvn

var setSampleSize = function(size){
  mySampleSize = size;
  getNewSamples();
  drawChart2DWithLine();
}

var getNewSample = function(){

// means of our three dimensions
  var meanVector = [0, 0];

  // covariance between dimensions. This examples makes the first and third
  // dimensions highly correlated, and the second dimension independent.
  var covarianceMatrix = [
      [ 1.0, myCorrelation],
      [ myCorrelation, 1.0],
  ];

  var distribution = window.MultivariateNormal.default(meanVector, covarianceMatrix);
  var currentSample = distribution.sample();
  return {
    x: currentSample[0],
    y: currentSample[1]
    };
}


function setSliderTicks(){
    var $slider =  $('#slider');
    var spacing =  50;

    $slider.find('.ui-slider-tick-mark').remove();
    for (var i = -.9; i < .9 ; i+=.1) {
        $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * (i + 1)) +  '%').appendTo($slider);
        $('<span class="ui-slider-tick-text">' + roundForDisplay(i,1) + '</span>').css('left', (spacing * (i + 1)) - 1 +  '%').css('top', '230%').appendTo($slider);
     }
}

(function( $, undefined ) {

    // Defines the custom implementation of the built-in slider widget.
    $.widget( "app.slider", $.ui.slider, {

        // The new "ticks" option defaults to false.
        options: {
            ticks: false
        },

        // Called when the slider is instantiated.
        _create: function() {

            // Call the orginal constructor, creating the slider normally.
            this._super();

            // Setup some variables for rendering the tick marks below the slider.
            var cnt = this.options.min,
                background = this.element.css( "border-color" ),
                left;

            while ( cnt < this.options.max ) {



                // Compute the "left" CSS property for the next tick mark.
                left = (( cnt / this.options.max * 100 ).toFixed( 2 ) / 2) + 50  + "%";



                // Creates the tick div, and adds it to the element. It adds the
                // "ui-slider-tick" class, which has common properties for each tick.
                // It also applies the computed CSS properties, "left" and "background".


                if((round(cnt,2) * 10 % 2) == 0)
                {$( "<div/>" ).html('<div class="ui-slider-tick" style="left: ' + left + '; background:rgb(128, 128, 128);"></div>' +
                      '<div class="ui-slider-tick-text" style="left: ' + left + ';color:	rgb(128, 128, 128); top:1.3em; margin-left: -.6em;">' + roundForDisplay(cnt,1) + '</div>')
                              .appendTo(this.element);}

                else if(isNaN((round(cnt,2)))){
                  $( "<div/>" ).html('<div class="ui-slider-tick" style="left: ' + left + '; background:rgb(128, 128, 128);"></div>' +
                        '<div class="ui-slider-tick-text" style="left: ' + left + ';color:	rgb(128, 128, 128); top:1.3em; margin-left: -.6em;">' + roundForDisplay(cnt,1) + '</div>')
                                .appendTo(this.element);
                }
                else{
                  {$( "<div/>" ).html('<div class="ui-slider-tick" style="left: ' + left + '; background:rgb(128, 128, 128);"></div>')
                                .appendTo(this.element);}
                }
                            //.addClass( "ui-slider-tick" )
                            // .appendTo( this.element )
                            // .css( { left: left, background: background } );


                cnt += this.options.step * 10;

            }

        }

    });

    var sliderTooltipSlide = function(event, ui) {
        myCorrelation = ui.value;
        if(isNaN(myCorrelation)){
          myCorrelation = 0.0;
        }
        var curValue = ui.value || initialValue;
        var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + roundForDisplay(curValue,2) + '</div><div class="tooltip-arrow"></div></div>';

        $('.ui-slider-handle').html(tooltip);

        getNewSamples();

        drawChart2DWithLine();

    }

    var sliderTooltipCreate = function(event, ui) {
        myCorrelation = ui.value;
        if(isNaN(myCorrelation)){
          myCorrelation = 0.0;
        }
        var curValue = ui.value || initialValue;
        var tooltip = '<div class="tooltip"><div class="tooltip-inner">' + roundForDisplay(curValue,2) + '</div><div class="tooltip-arrow"></div></div>';

        $('.ui-slider-handle').html(tooltip);

    }

    $(function() {

        $( "#slider" ).slider({
            min: -1,
      			max: 1,
      			step: .01,
            create: sliderTooltipCreate,
            slide: sliderTooltipSlide,

        });

    });

})( jQuery );

var getNewSamples = function(){
  xValues = [];
  yValues = [];
  for(var i = 0; i < mySampleSize; i++){
    var currentSample = getNewSample();
    xValues[i] = currentSample.x;
    yValues[i] = currentSample.y;
  }
}

// draw charts with Plotly
var drawChart2D = function() {

	    var data = [{
	        x: xValues,
	        y: yValues,
	        mode: "markers",
	        type: "scattergl",
	        marker: { opacity: 0.7 }
	    }];

	    Plotly.newPlot("renderTarget", data,
      {
  				title:'',
  				xaxis: {
  						title: '',
  						range: [-4, 4],
  						autotick: false,
  						ticks: 'outside',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				yaxis:{
  						title:'',
  						range: [-4,4],
  						autotick: false,
  						ticks: '',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				font: {
  						size: 16,
  						family: 'Roboto Slab, serif',
  						color: '#3B317D'},
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
  			});
};

var drawChart2DWithLine = function() {

	    var data = {
	        x: xValues,
	        y: yValues,
	        mode: "markers",
	        type: "scattergl",
	        marker: { opacity: 0.7 }
	    };

			var l = ss.linearRegressionLine({ b: 0, m: myCorrelation })

			console.log(l(10))
			console.log(l(-10))

			var correctLine = {
				x: [-10, 10],
				y: [l(-10), l(10)],
				mode: 'lines',
				line: {
					color: '#FF6000',
					width: 1
				},
				type: "scattergl",
				name: '',
			};

			var data2 = [ data, correctLine ];


			Plotly.purge("renderTarget")

	    Plotly.newPlot("renderTarget", data2,
			{
  				title:'',
					showlegend: false,
  				xaxis: {
  						title: '',
  						range: [-4, 4],
  						autotick: false,
  						ticks: 'outside',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				yaxis:{
  						title:'',
  						range: [-4,4],
  						autotick: false,
  						ticks: '',
  						tick0: 0,
  						dtick: 2,
  						ticklen: 8,
  						tickwidth: 0,
  						tickcolor: '#000'},
  				font: {
  						size: 16,
  						family: 'Roboto Slab, serif',
  						color: '#3B317D'},
          margin: {
            l: 50,
            r: 50,
            b: 50,
            t: 50,
            pad: 4
          }
  			});



};


$( document ).ready(function() {
    getNewSamples();
    drawChart2DWithLine();
});
