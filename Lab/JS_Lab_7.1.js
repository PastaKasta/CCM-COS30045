// Set up canvas dimensions
var w = 600;
var h = 300;
var padding = 70;

// Load the CSV data
d3.csv("Unemployment_78-95.csv").then(function(data) {

    // Parse the data and create Date objects
    data.forEach(function(d) {
        d.date = new Date(d.year, d.month - 1); // Convert year and month to Date object
        d.number = +d.number;  // Ensure the unemployment number is numeric
    });

    // Create scales for x (time) and y (number)
    var xScale = d3.scaleTime()
                   .domain(d3.extent(data, d => d.date))  // Use extent to get the min and max of dates
                   .range([padding, w - padding]);

    var yScale = d3.scaleLinear()
                   .domain([0, d3.max(data, d => d.number)])  // Start y from 0 up to the max unemployment number
                   .range([h - padding, padding]);  // Invert the y-axis (larger values on top)

    // Define the line generator
    var line = d3.line()
                 .x(d => xScale(d.date))
                 .y(d => yScale(d.number));

    // Define the area generator (for area chart)
    var area = d3.area()
                 .x(d => xScale(d.date))
                 .y0(h - padding)  // Bottom of the chart (y=0 value)
                 .y1(d => yScale(d.number));  // Top is the unemployment number

    // Create the SVG element
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Append the area path (for area chart)
    svg.append("path")
       .datum(data)
       .attr("class", "area")
       .attr("d", area);

    // Append the line path (for line chart)
    svg.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("d", line);

    // Add the x-axis
    var xAxis = d3.axisBottom(xScale);

    svg.append("g")
       .attr("transform", `translate(0, ${h - padding})`)
       .call(xAxis);

    // Add the y-axis
    var yAxis = d3.axisLeft(yScale);

    svg.append("g")
       .attr("transform", `translate(${padding}, 0)`)
       .call(yAxis);

    // Add a reference line for 500,000 unemployed
    svg.append("line")
       .attr("x1", padding)
       .attr("y1", yScale(500000))
       .attr("x2", w - padding)
       .attr("y2", yScale(500000))
       .attr("stroke", "red")
       .attr("stroke-dasharray", "5,5");

    // Add text annotation for 500,000 unemployed
    svg.append("text")
       .attr("x", w - padding)
       .attr("y", yScale(500000) - 10)
       .attr("fill", "red")
       .text("500,000 unemployed");
});
