// Initial dataset
var dataset = [24,10,29,19,8,15,20,12,9,6,21,28];
var numValues = dataset.length;

// Chart dimensions and padding
const margin = {top: 50, right: 20, bottom: 50, left: 50};
var w = 500 - margin.left - margin.right;
var h = 300 - margin.top - margin.bottom;

// Create the SVG element
var svg = d3.select("svg")
            .attr("width", w + margin.left + margin.right)
            .attr("height", h + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define the xScale and yScale
var xScale = d3.scaleBand()
                .domain(d3.range(dataset.length)) 
                .range([0, w])
                .paddingInner(0.05);

var yScale = d3.scaleLinear()
                .domain([0, d3.max(dataset)])
                .range([h, 0]);

// Create the initial bars
svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
        return xScale(i);
    })
    .attr("y", function(d) {
        return yScale(d);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
        return h - yScale(d);
    })
    .attr("fill", "blue");

// X Axis
var xAxis = d3.axisBottom(xScale)
              .tickFormat(function(d, i) { return i + 1; }); 

// Append the X axis
svg.append("g")
   .attr("class", "x-axis")
   .attr("transform", "translate(0," + h + ")") // Position it at the bottom
   .call(xAxis);

// Button click event to update data
d3.select("#update").on("click", function() {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);
        dataset.push(newNumber);
    }

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset)]);

    svg.selectAll("rect")
        .data(dataset)
        .transition(1000) 
        .delay(100)
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("height", function(d) {
            return h - yScale(d);
        });

    console.log("New dataset: ", dataset);
});

// Button click event to update data
d3.select("#trans1").on("click", function() {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);
        dataset.push(newNumber);
    }

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset)]);

    svg.selectAll("rect")
        .data(dataset)
        .transition() 
        .delay(function(d, i){
            return i * 100;
        })
        .ease(d3.easeCircleOut)
        .duration(500)
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("height", function(d) {
            return h - yScale(d);
        });

    console.log("New dataset: ", dataset);
});


// Button click event to update data
d3.select("#trans2").on("click", function() {
    // Generate new random dataset
    dataset = [];
    for (var i = 0; i < numValues; i++) {
        var newNumber = Math.floor(Math.random() * 25);
        dataset.push(newNumber);
    }

    // Update yScale to reflect new dataset
    yScale.domain([0, d3.max(dataset)]);

    svg.selectAll("rect")
        .data(dataset)
        .transition() 
        .delay(function(d, i){
            return i * 100;
        })
        .ease(d3.easeElasticOut)
        .duration(2000)
        .attr("y", function(d) {
            return yScale(d);
        })
        .attr("height", function(d) {
            return h - yScale(d);
        });

    console.log("New dataset: ", dataset);
});