/* app.js */
/* Map heavily modeled after Mike Bostock's code from Chapter 12 (05_choropleth.js) */

// CREATE MAP

//Width and height
var w = 1000;
var h = 550;
//Define map projection
var projection = d3.geo.albersUsa()
    .translate([w / 2 + 100, h / 2])
    .scale([1100]);

//Define path generator
var path = d3.geo.path()
    .projection(projection);

//var step = 0;
//var current_year = 2008;
//var filename = ("data" + current_year + ".csv").toString();

//Colors taken from colorbrewer.js, included in the D3 download
//Define quantize scale to sort data values into buckets of color
var color = d3.scale.quantize()
.range([
    'rgb(199,210,225)',
    'rgb(151,169,195)',
    'rgb(103,129,166)',
    'rgb(55,88,136)',
    'rgb(8,48,107)'
]);

//Create SVG element
var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

/* display(current_year);

d3.select("#slider").on('change', function(d) {       
       var incrementation = parseInt(this.value);
       current_year = (2008 + incrementation);
       d3.select("#year").text(""+current_year);
       svg.selectAll("path").remove();
       svg.selectAll(".dot").remove();
       return display(current_year);
});
*/
//Some of the code to bind outbreak and vaccination data to the slider was inspired by this d3 visualization: http://bl.ocks.org/carsonfarmer/11478345
//Load in vaccination rates data
function display(Year) {

    var grade = [];
    var firearmRates = [];

    d3.csv("../data/gun_law_grade.csv", function (data) {
        data.forEach(function(d) {
            if (d.year == Year) {
                grade.push(d);
        }

        //Set input domain for color scale
        color.domain([
                d3.min(grade, function (d) {
                return (d.percentage);
            }),
                d3.max(grade, function (d) {
                return (d.percentage);
            })
        ]);
    });

    console.log("*** The following is the gun grade data");
    console.log(grade);

    d3.csv("../data/firearms_mortality.csv", function(firearmDeathsAll) {
        console.log(Year);
        firearmDeathsAll.forEach(function(d) {
            if (d.year == Year) {
                firearmRates.push(d);
            }
        });
    });

    console.log("*** The following is the resulting firearm death rates");
    console.log(firearmRates);

    //Code copied from Mike Bostock's Chater 12 choropleth.js
    //Load in GeoJSON data & merge with gun laws grade
    d3.json("../data/us-states.json", function (json) {
        //Merge the ag. data and GeoJSON
        //Loop through once for each ag. data value
        for (var i = 0; i < grade.length; i++) {
            //Grab state name
            var gradeState = grade[i].state;
            //Grab data value, and convert from string to float
            var gradeValue = parseFloat(grade[i].percentage);
            var stateGrade = grade[i].grade

            //Find the corresponding state inside the GeoJSON
            for (var j = 0; j < json.features.length; j++) {
                var jsonState = json.features[j].properties.name;

                if (gradeState == jsonState) {
                    //Copy the data value into the JSON
                    json.features[j].properties.value = gradeValue;
                    json.features[j].properties.grade = stateGrade;

                    //Stop looking through the JSON
                    break;
                }
            }
        }

        //Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function (d) {
                //Get data value
                var value = d.properties.value;

                if (value) {
                    //If value exists…
                    return color(value);
                } else {
                    //If value is undefined…
                    return "#ccc";
                }
            })

            //code modified from Mike Bostock's Chaper 12 example scripts
            .on("mouseover", function(d) {
            
                var stateGrade = Math.round((d.properties.value) * 100) / 100;
                var state = d.properties.name;
                var stateGrade = d.properties.grade;
                    //Update the tooltip position and value
                d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")						
                    .select("#value")
                    .html('<b>State:</b> ' + state + '<br/><b>Gun Law Grade:</b> ' + stateGrade);

                    //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
            })

            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip").classed("hidden", true);
            });            
                
        svg.selectAll(".dot")
            .data(firearmRates)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", function(d) {
                console.log(d.state, d.lat, d.lon, d.year, d.RATE, d.DEATHS);
                return projection([d.lon, d.lat])[0];
                // return projection(+d.lon);
            })
            .attr("cy", function(d) {
                return projection([d.lon, d.lat])[1];
                // return projection(+d.lat);
            })
            .attr("r", function(d) {
                //return Math.sqrt(parseInt(Math.log(d.RATE+1)*50));
                return d.RATE;
            })
            .style("fill", "red")
        
            // Code modified from Mike Bostock's Chapter 12 example scripts
            .on("mouseover", function(d) {
                // Update the tooltip position and value
                d3.select("#tooltip")
                    .style("left", d3.event.pageX + "px")
                    .style("top", d3.event.pageY + "px")						
                    .select("#value")
                    .html('<b>State:</b> ' + d.state + '<br/><b>Firearm Deaths:</b> ' + d.DEATHS + 
                            '<br/><b>Firearm Mortality Rate:</b> ' + d.RATE + ' per 100,000');

                //Show the tooltip
                d3.select("#tooltip").classed("hidden", false);
            })

            .on("mouseout", function() {
                //Hide the tooltip
                d3.select("#tooltip").classed("hidden", true);
            });
        });
    });
}
