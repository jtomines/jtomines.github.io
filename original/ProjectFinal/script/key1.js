/* key.js */

var width = 1100,
    height = 150,
    formatPercent = d3.format(".0%"),
    formatNumber = d3.format(".0f");

var threshold = d3.scale.threshold()
    .domain([.60, .70, .80, .90, 1])

.range([
    'rgb(199,210,225)',
    'rgb(151,169,195)',
    'rgb(103,129,166)',
    'rgb(55,88,136)',
    'rgb(8,48,107)'
]);



// A position encoding for the key only.
var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, 300]);

console.log(x)

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(threshold.domain())
    .tickFormat(function (d) {
        return d === 6 ? formatPercent(d) : formatNumber(100 * d);
    });

//positioning affects the slider
var svg2 = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//positioning affects the key
var g = svg2.append("g")
    .attr("class", "key")
    .attr("transform", "translate(" + (width - 240) / 2 + "," + height / 2 + ")");

g.selectAll("rect")
    .data(threshold.range().map(function (color) {
        var d = threshold.invertExtent(color);
        if (d[0] == null) d[0] = x.domain()[0];
        if (d[1] == null) d[1] = x.domain()[1];
        return d;
    }))
    .enter().append("rect")
    .attr("height", 8)
    .attr("x", function (d) {
        return x(d[0]);
    })
    .attr("width", function (d) {
        return x(d[1]) - x(d[0]);
    })
    .style("fill", function (d) {
        return threshold(d[0]);
    });

g.call(xAxis).append("text")
    .attr("class", "caption")
    .attr("y", -6)
    .attr("x", 60)
    .text("Grade of State Gun Laws (%)");