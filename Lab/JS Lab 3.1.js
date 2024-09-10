var height = 500;
var width = 500;
var padding = 20;

var dataSet = [
    [5, 20],
    [25, 67],
    [85, 21],
    [100, 33],
    [220, 88],
    [250, 50],
    [330, 95],
    [410, 12],
    [475, 44],
    [500, 90],
    [1000,99]
];

// Extract y-values to calculate quartiles and IQR
var yValues = dataSet.map(function(d) { return d[1]; });
yValues.sort(d3.ascending);

var q1 = d3.quantile(yValues, 0.25);
var q3 = d3.quantile(yValues, 0.75);
var iqr = q3 - q1;

var lowerBound = q1 - 1.5 * iqr;
var upperBound = q3 + 1.5 * iqr;

var xScale = d3.scaleLinear()
    .domain([d3.min(dataSet, function(d) { return d[0]; }), d3.max(dataSet, function(d) { return d[0]; })])
    .range([padding, width - padding]);

var yScale = d3.scaleLinear()
    .domain([d3.min(dataSet, function(d) { return d[1]; }), d3.max(dataSet, function(d) { return d[1]; })])
    .range([padding, height - padding]);

var svg = d3.select("#container")
    .append("svg")
    .attr("width", width )
    .attr("height", height);

svg.selectAll("circle")
    .data(dataSet)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
        return xScale(d[0]);
    })
    .attr("cy", function (d) {
        return yScale(d[1]);
    })
    .attr("r", 5)
    .attr("fill", function(d) {
        return (d[1] < lowerBound || d[1] > upperBound) ? "#FF0000" : "#0000FF"; // Red for outliers, Blue for others
    });

svg.selectAll("text")
    .data(dataSet)
    .enter()
    .append("text")
    .text(function (d) {
        return d[0] + "," + d[1];
    })
    .attr("x", function (d) {
        return xScale(d[0]) - 15;
    })
    .attr("y", function (d) {
        return yScale(d[1]) - 10;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black");