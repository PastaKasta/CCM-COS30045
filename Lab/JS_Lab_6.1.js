// Initial dataset
let dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];
let numValues = dataset.length;

// Chart dimensions and margins
const margin = { top: 50, right: 20, bottom: 50, left: 50 };
const svgWidth = 500;
const svgHeight = 300;
const w = svgWidth - margin.left - margin.right;
const h = svgHeight - margin.top - margin.bottom;

// Select the SVG element and set its dimensions
const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Create a group element for margins
const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Scaling functions
let xScale = d3.scaleBand()
    .domain(d3.range(numValues))
    .range([0, w])
    .padding(0.1);

let yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([h, 0]);

// Create axes
function createAxes() {
    // Remove existing axes if any
    chartGroup.selectAll(".axis").remove();

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5);
    chartGroup.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);

    // X Axis
    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => i + 1);
    chartGroup.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);
}

// Function to draw bars with mouse effects and tooltips
function drawBars() {
    // Bind the data to the bars
    const bars = chartGroup.selectAll(".bar")
        .data(dataset);

    // Enter new bars
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - yScale(d))
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            // Change color to orange on mouseover
            d3.select(this).attr("fill", "orange");

            // Create tooltip text
            chartGroup.append("text")
                .attr("id", "tooltip")
                .attr("x", parseFloat(d3.select(this).attr("x")) + xScale.bandwidth() / 2)
                .attr("y", parseFloat(d3.select(this).attr("y")) - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .text(d);
        })
        .on("mouseout", function() {
            // Revert color to steelblue on mouseout
            d3.select(this).attr("fill", "steelblue");

            // Remove tooltip
            d3.select("#tooltip").remove();
        });

    // Update existing bars
    bars.transition()
        .duration(500)
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("height", d => h - yScale(d));

    // Remove old bars
    bars.exit().remove();
}

// Function to update the dataset with new random values (transform data)
function transformData() {
    // Update the dataset with random values between 0 and 25
    dataset = dataset.map(() => Math.floor(Math.random() * 25));
    numValues = dataset.length;

    // Update the yScale domain
    yScale.domain([0, d3.max(dataset)]);

    // Update the axes and redraw bars
    updateChart();
}

// Function to remove the last bar (LIFO)
function removeLastBar() {
    if (dataset.length === 0) {
        alert("Dataset is empty. Cannot remove any more bars.");
        return;
    }

    // Remove the last element from the dataset
    dataset.pop();
    numValues = dataset.length;

    // Update the xScale domain
    xScale.domain(d3.range(numValues));

    // Update the axes and redraw bars
    updateChart();
}

// Function to add a new bar (update data)
function updateData() {
    // Generate a new random number and add it to the dataset
    const newNumber = Math.floor(Math.random() * 25);
    dataset.push(newNumber);
    numValues = dataset.length;

    // Update the xScale and yScale domains
    xScale.domain(d3.range(numValues));
    yScale.domain([0, d3.max(dataset)]);

    // Re-render the chart with the updated data
    updateChart();
}

// Initial render
createAxes();
drawBars();

// Function to update the chart
function updateChart() {
    createAxes();
    drawBars();
}

// Event listeners for buttons
document.getElementById("update").addEventListener("click", updateData);
document.getElementById("transform").addEventListener("click", transformData);
document.getElementById("remove").addEventListener("click", removeLastBar);
