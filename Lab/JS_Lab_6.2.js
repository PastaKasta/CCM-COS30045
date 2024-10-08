// Initial dataset
let dataset = [24, 10, 29, 19, 8, 15, 20, 12, 9, 6, 21, 28];
let numValues = dataset.length;
let sortAscending = true; // Track sort direction

// Chart dimensions and margins
const margin = { top: 50, right: 20, bottom: 50, left: 50 };
const svgWidth = 500;
const svgHeight = 300;
const w = svgWidth - margin.left - margin.right;
const h = svgHeight - margin.top - margin.bottom;

// Select the SVG element and set its dimensions
const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Scaling Functions
const xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([0, w])
    .padding(0.1);

const yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([h, 0]);

// Create axes
function createAxes() {
    // X Axis
    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => i + 1);

    // Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5);

    // Remove previous axes (if any) and redraw them
    svg.select(".x-axis").remove();
    svg.select(".y-axis").remove();

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${h})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
}

// Draw bars with mouse effects and tooltips
function drawBars() {
    const bars = svg.selectAll(".bar")
        .data(dataset, (d, i) => i);

    // Remove old bars
    bars.exit().remove();

    // Update existing bars
    bars.attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - yScale(d));

    // Enter new bars
    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d))
        .attr("width", xScale.bandwidth())
        .attr("height", d => h - yScale(d))
        .attr("fill", "steelblue")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("fill", "orange");

            // Tooltip
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", +d3.select(this).attr("x") + xScale.bandwidth() / 2)
                .attr("y", +d3.select(this).attr("y") - 10)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("fill", "black")
                .text(d);
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "steelblue");

            // Remove tooltip
            svg.select("#tooltip").remove();
        });
}

// Function to update the dataset with new random values
function transformData() {
    // Update the dataset with random values between 0 and 25
    dataset = dataset.map(() => Math.floor(Math.random() * 25));
    numValues = dataset.length;

    // Update scales and axes
    yScale.domain([0, d3.max(dataset)]);
    createAxes();

    // Update the bars with transition
    svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(500)
        .attr("y", d => yScale(d))
        .attr("height", d => h - yScale(d));
}

// Function to remove the last bar (LIFO)
function removeLastBar() {
    if (dataset.length === 0) {
        alert("Dataset is empty. Cannot remove any more bars.");
        return;
    }

    // Remove the last element from the dataset (LIFO)
    dataset.pop();
    numValues = dataset.length;

    // Update the scales and axes
    yScale.domain([0, d3.max(dataset)]);
    xScale.domain(d3.range(dataset.length));
    createAxes();

    // Remove the last bar
    drawBars();
}

// Function to add a new bar (update data)
function updateData() {
    const newNumber = Math.floor(Math.random() * 25);
    dataset.push(newNumber);
    numValues = dataset.length;

    // Update the scales and axes
    yScale.domain([0, d3.max(dataset)]);
    xScale.domain(d3.range(dataset.length));
    createAxes();

    drawBars();
}

// Function to sort the bars
function sortData() {
    dataset.sort((a, b) => sortAscending ? a - b : b - a);
    sortAscending = !sortAscending;

    // Redraw bars based on the sorted dataset
    drawBars();
}

// Initial Render
createAxes();
drawBars();

// Event listeners for buttons
document.getElementById("update").addEventListener("click", updateData);
document.getElementById("transform").addEventListener("click", transformData);
document.getElementById("remove").addEventListener("click", removeLastBar);
document.getElementById("sort").addEventListener("click", sortData);
