var height = 500;
var width = 500;
var padding = 40; // Increased padding to make space for axes

var dataSet = [
    [2, 8],
    [3, 5],
    [5, 17],
    [6, 6],
    [6, 12],
    [7, 20],
    [8, 22],
    [10, 11],
    [5, 12],
    [6, 16]
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
    .range([height - padding, padding]);

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

// Add X axis
var xAxis = d3.axisBottom(xScale);
svg.append("g")
    .attr("transform", "translate(0," + (height - padding) + ")") // Move the axis to the bottom
    .call(xAxis);

// Add Y axis
var yAxis = d3.axisLeft(yScale);
svg.append("g")
    .attr("transform", "translate(" + padding + ",0)") // Move the axis to the left
    .call(yAxis);

    // Add X axis label
svg.append("text")
.attr("x", width / 2) // Center the label horizontally
.attr("y", height - 5) // Position the label slightly below the axis
.attr("text-anchor", "middle") // Center the text
.attr("font-family", "sans-serif")
.attr("font-size", "14px")
.text("Tree Age (years)");

// Add Y axis label
svg.append("text")
.attr("transform", "rotate(-90)") // Rotate the label
.attr("x", -height / 2) // Center the label vertically
.attr("y", 15) // Position the label slightly left of the axis
.attr("text-anchor", "middle") // Center the text
.attr("font-family", "sans-serif")
.attr("font-size", "14px")
.text("Tree Height (m)");