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
const svg = document.querySelector("svg");
svg.setAttribute("width", svgWidth);
svg.setAttribute("height", svgHeight);

// Create a group element for margins
const chartGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
chartGroup.setAttribute("transform", `translate(${margin.left},${margin.top})`);
svg.appendChild(chartGroup);

// Scaling Functions
function xScale(index) {
    const bandWidth = w / numValues;
    return index * bandWidth;
}

function yScale(value) {
    const maxVal = Math.max(...dataset, 1); // Prevent division by zero
    return h - (value / maxVal) * h;
}

// Function to create axes
function createAxes() {
    // Remove existing axes if any
    const existingAxes = chartGroup.querySelectorAll('.axis');
    existingAxes.forEach(axis => chartGroup.removeChild(axis));

    // Y Axis
    const yAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    yAxis.setAttribute("class", "axis y-axis");
    chartGroup.appendChild(yAxis);

    const maxVal = Math.max(...dataset, 1);
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
        const y = i * (h / yTicks);
        const value = Math.round(maxVal - (i * maxVal / yTicks));

        // Tick line
        const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tickLine.setAttribute("x1", -5);
        tickLine.setAttribute("y1", y);
        tickLine.setAttribute("x2", 0);
        tickLine.setAttribute("y2", y);
        tickLine.setAttribute("stroke", "black");
        yAxis.appendChild(tickLine);

        // Tick label
        const tickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tickLabel.setAttribute("x", -10);
        tickLabel.setAttribute("y", y + 5); // +5 to vertically center the text
        tickLabel.setAttribute("text-anchor", "end");
        tickLabel.setAttribute("font-size", "12px");
        tickLabel.textContent = value;
        yAxis.appendChild(tickLabel);

        // Grid line
        const gridLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        gridLine.setAttribute("x1", 0);
        gridLine.setAttribute("y1", y);
        gridLine.setAttribute("x2", w);
        gridLine.setAttribute("y2", y);
        gridLine.setAttribute("stroke", "#e0e0e0");
        gridLine.setAttribute("stroke-dasharray", "2,2");
        chartGroup.appendChild(gridLine);
    }

    // X Axis
    const xAxis = document.createElementNS("http://www.w3.org/2000/svg", "g");
    xAxis.setAttribute("class", "axis x-axis");
    xAxis.setAttribute("transform", `translate(0, ${h})`);
    chartGroup.appendChild(xAxis);

    for (let i = 0; i < numValues; i++) {
        const x = xScale(i) + (w / numValues) / 2;

        // Tick line
        const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tickLine.setAttribute("x1", x);
        tickLine.setAttribute("y1", 0);
        tickLine.setAttribute("x2", x);
        tickLine.setAttribute("y2", 5);
        tickLine.setAttribute("stroke", "black");
        xAxis.appendChild(tickLine);

        // Tick label
        const tickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tickLabel.setAttribute("x", x);
        tickLabel.setAttribute("y", 20);
        tickLabel.setAttribute("text-anchor", "middle");
        tickLabel.setAttribute("font-size", "12px");
        tickLabel.textContent = i + 1;
        xAxis.appendChild(tickLabel);
    }
}

// Function to draw bars
function drawBars() {
    // Remove existing bars
    const existingBars = chartGroup.querySelectorAll('.bar');
    existingBars.forEach(bar => chartGroup.removeChild(bar));

    // Create bars
    dataset.forEach((d, i) => {
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("class", "bar");
        rect.setAttribute("x", xScale(i));
        rect.setAttribute("y", yScale(d));
        rect.setAttribute("width", w / numValues - 10); // 10px padding between bars
        rect.setAttribute("height", h - yScale(d));
        rect.setAttribute("fill", "steelblue");
        rect.style.transition = "all 0.5s ease";
        chartGroup.appendChild(rect);
    });
}

// Function to update the dataset with new random values (transform data) with animation
function transformData() {
    // Update the dataset with random values between 0 and 25
    dataset = dataset.map(() => Math.floor(Math.random() * 25));

    // Select all bars and update their heights and positions
    const bars = chartGroup.querySelectorAll(".bar");
    bars.forEach((bar, i) => {
        bar.style.transition = "all 0.5s ease";  // Add transition effect
        bar.setAttribute("y", yScale(dataset[i]));  // Update y position based on new value
        bar.setAttribute("height", h - yScale(dataset[i]));  // Update height based on new value
    });

    // Update Y Axis and scales
    createAxes();
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

    // Update the scales
    const bars = chartGroup.querySelectorAll(".bar");

    // Animate the removal of the last bar by transitioning it to the right
    const lastBar = bars[bars.length - 1];
    lastBar.setAttribute("x", w);  // Move the last bar to the right
    lastBar.style.transition = "x 0.5s ease"; // Apply the transition

    // After the transition, remove the bar from the DOM
    setTimeout(() => {
        chartGroup.removeChild(lastBar);

        // After removing the last bar, update the remaining bars
        updateChart();
    }, 500);
}

// Function to add a new bar (update data)
function updateData() {
    // Generate a new random number and add it to the dataset
    const newNumber = Math.floor(Math.random() * 25);
    dataset.push(newNumber);
    numValues = dataset.length;
    updateChart();
    console.log("New dataset:", dataset);
}

// Initial Render
createAxes();
drawBars();

// Function to update the chart
function updateChart() {
    createAxes();
    drawBars();
}

// Event listeners for buttons
document.getElementById("update").addEventListener("click", () => {
    updateData();
});

document.getElementById("transform").addEventListener("click", () => {
    transformData();
});

document.getElementById("remove").addEventListener("click", () => {
    removeLastBar();
});
