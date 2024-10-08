// Step 1: Set up the data
const dataset = [10, 20, 30, 40, 50, 60]; // Sample data

// Set up the SVG canvas dimensions
const width = 300;
const height = 300;
const radius = Math.min(width, height) / 2;

// Create the SVG element and group it in the center
const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`); // Center the pie chart

// Step 2: Set up the pie chart parameters
const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale

const pie = d3.pie()
    .value(d => d)(dataset); // Create pie layout with data

const arc = d3.arc()
    .outerRadius(radius)
    .innerRadius(50); // For a donut chart, change innerRadius to greater than 0

// Step 3: Set up the arcs and draw them
svg.selectAll('path')
    .data(pie)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => color(i))
    .attr('stroke', 'white')
    .attr('stroke-width', '2px');

// Step 4: Add text labels to the pie chart
svg.selectAll('text')
    .data(pie)
    .enter()
    .append('text')
    .text(d => d.data) // Access the value using d.data
    .attr('transform', d => `translate(${arc.centroid(d)})`) // Move the label to the center of each slice
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('fill', 'black'); // Adjust text styling
