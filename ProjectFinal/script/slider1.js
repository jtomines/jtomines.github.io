/*slider.js */

var step = 0;
var current_year = 2014;

display(current_year);

d3.select("#slider").on('change', function(d) {       
       var incrementation = parseInt(this.value);
       current_year = (2014 + incrementation);
       d3.select("#year").text(""+current_year);
       svg.selectAll("path").remove();
       svg.selectAll(".dot").remove();
       return display(current_year);
});
