// JS_Lab_5.3.js

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
    // Calculate the width of each band and return the x position for the given index
    const bandWidth = w / numValues;
    return index * bandWidth;
}

function yScale(value) {
    // Calculate the y position for a given value, scaling it relative to the maximum value in the dataset
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

        // Create tick line for Y axis
        const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tickLine.setAttribute("x1", -5);
        tickLine.setAttribute("y1", y);
        tickLine.setAttribute("x2", 0);
        tickLine.setAttribute("y2", y);
        tickLine.setAttribute("stroke", "black");
        yAxis.appendChild(tickLine);

        // Create tick label for Y axis
        const tickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tickLabel.setAttribute("x", -10);
        tickLabel.setAttribute("y", y + 5); // +5 to vertically center the text
        tickLabel.setAttribute("text-anchor", "end");
        tickLabel.setAttribute("font-size", "12px");
        tickLabel.textContent = value;
        yAxis.appendChild(tickLabel);

        // Create grid line for Y axis
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

        // Create tick line for X axis
        const tickLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        tickLine.setAttribute("x1", x);
        tickLine.setAttribute("y1", 0);
        tickLine.setAttribute("x2", x);
        tickLine.setAttribute("y2", 5);
        tickLine.setAttribute("stroke", "black");
        xAxis.appendChild(tickLine);

        // Create tick label for X axis
        const tickLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
        tickLabel.setAttribute("x", x);
        tickLabel.setAttribute("y", 20);
        tickLabel.setAttribute("text-anchor", "middle");
        tickLabel.setAttribute("font-size", "12px");
        tickLabel.textContent = i + 1;
        xAxis.appendChild(tickLabel);
    }
}

// Function to draw bars with mouse effects and tooltips
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
        rect.style.transition = "fill 0.3s ease"; // Smooth transition for fill color

        // Add event listeners for mouseover and mouseout
        rect.addEventListener("mouseover", function(event) {
            // Change color to orange on mouseover
            rect.setAttribute("fill", "orange");

            // Calculate tooltip position
            const rectX = parseFloat(rect.getAttribute("x"));
            const rectWidth = parseFloat(rect.getAttribute("width"));
            const rectY = parseFloat(rect.getAttribute("y"));
            const tooltipX = rectX + rectWidth / 2;
            const tooltipY = rectY - 10; // 10px above the bar

            // Create tooltip text
            const tooltip = document.createElementNS("http://www.w3.org/2000/svg", "text");
            tooltip.setAttribute("id", "tooltip");
            tooltip.setAttribute("x", tooltipX);
            tooltip.setAttribute("y", tooltipY);
            tooltip.setAttribute("text-anchor", "middle");
            tooltip.setAttribute("font-size", "12px");
            tooltip.setAttribute("fill", "black");
            tooltip.textContent = d;

            // Optional: Add background rectangle for better visibility
            const bbox = tooltip.getBBox();
            const padding = 2;
            const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            background.setAttribute("x", bbox.x - padding);
            background.setAttribute("y", bbox.y - padding);
            background.setAttribute("width", bbox.width + padding * 2);
            background.setAttribute("height", bbox.height + padding * 2);
            background.setAttribute("fill", "white");
            background.setAttribute("stroke", "black");
            background.setAttribute("stroke-width", "0.5");
            background.setAttribute("rx", "2"); // Rounded corners for a cleaner look

            // Group tooltip elements
            const tooltipGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
            tooltipGroup.setAttribute("id", "tooltip-group");
            tooltipGroup.appendChild(background);
            tooltipGroup.appendChild(tooltip);

            chartGroup.appendChild(tooltipGroup);
        });

        rect.addEventListener("mouseout", function() {
            // Revert color to steelblue on mouseout
            rect.setAttribute("fill", "steelblue");

            // Remove tooltip group on mouseout
            const tooltipGroup = chartGroup.querySelector("#tooltip-group");
            if (tooltipGroup) {
                chartGroup.removeChild(tooltipGroup);
            }
        });

        // Remove browser tooltip by commenting out the <title> element
        /*
        const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        title.textContent = `Value: ${d}`;
        rect.appendChild(title);
        */

        chartGroup.appendChild(rect);
    });
}

// Function to update the dataset with new random values (transform data) with animation
function transformData() {
    // Update the dataset with random values between 0 and 25
    dataset = dataset.map(() => Math.floor(Math.random() * 25));
    numValues = dataset.length;

    // Update Y Axis and scales
    createAxes();

    // Select all bars and update their heights and positions
    const bars = chartGroup.querySelectorAll(".bar");
    bars.forEach((bar, i) => {
        // Apply transition for smooth animation
        bar.style.transition = "all 0.5s ease";
        bar.setAttribute("y", yScale(dataset[i])); // Update y position based on new value
        bar.setAttribute("height", h - yScale(dataset[i])); // Update height based on new value
    });
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
    createAxes();

    // Remove the last bar with a transition
    const bars = chartGroup.querySelectorAll(".bar");
    const lastBar = bars[bars.length - 1];
    if (lastBar) {
        // Apply transition to fade out and shrink the bar before removing it
        lastBar.style.transition = "opacity 0.5s ease, height 0.5s ease, y 0.5s ease";
        lastBar.setAttribute("opacity", 0);
        lastBar.setAttribute("height", 0);
        lastBar.setAttribute("y", h);

        // After the transition, remove the bar from the DOM
        setTimeout(() => {
            if (lastBar.parentNode === chartGroup) {
                chartGroup.removeChild(lastBar);
            }
        }, 500);
    }
}

// Function to add a new bar (update data)
function updateData() {
    // Generate a new random number and add it to the dataset
    const newNumber = Math.floor(Math.random() * 25);
    dataset.push(newNumber);
    numValues = dataset.length;
    createAxes();
    drawBars();
    console.log("New dataset:", dataset);
}

// Initial Render
createAxes();
drawBars();

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