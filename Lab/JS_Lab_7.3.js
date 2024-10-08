var dataset = [
    { apples: 5, oranges: 10, grapes: 22 },
    { apples: 4, oranges: 12, grapes: 28 },
    { apples: 2, oranges: 19, grapes: 32 },
    { apples: 7, oranges: 23, grapes: 35 },
    { apples: 23, oranges: 17, grapes: 43 }
];

// Set up the stack
// Reverse the keys array so the largest category (grapes) is stacked first
const keys = ['grapes', 'oranges', 'apples']; // Order by largest category first

const stack = d3.stack()
    .keys(keys);

const series = stack(dataset);

// Set up SVG and margins
const svgWidth = 500;
const svgHeight = 300;
const margin = { top: 20, right: 20, bottom: 40, left: 40 };
const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create SVG element inside the chart-container div
const svg = d3.select("#chart-container svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Custom colors for the categories (grapes, oranges, apples)
const colorArray = ['#d5d0d9', '#f9e9d3', '#e09123']; // Color for grapes, oranges, apples in reversed order

const color = d3.scaleOrdinal()
    .domain(keys)
    .range(colorArray); // Use custom color array

// Scales
const xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, width])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset, d => d.apples + d.oranges + d.grapes)])
    .range([height, 0]);

// Bind data and draw rectangles
const groups = svg.selectAll("g.layer")
    .data(series)
    .enter()
    .append("g")
    .attr("class", "layer")
    .attr("fill", (d, i) => color(keys[i])); // Assign color based on the reversed order

groups.selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d[1])) // Upper bound
    .attr("height", d => yScale(d[0]) - yScale(d[1])) // Height from lower to upper bound
    .attr("width", xScale.bandwidth());

// Add x-axis
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale).tickFormat((d, i) => `Data ${i + 1}`));

// Add y-axis
svg.append("g")
    .call(d3.axisLeft(yScale));
