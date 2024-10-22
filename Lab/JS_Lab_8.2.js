const width = 700;
const height = 500;

const svg = d3.select('#container').append('svg')
    .attr('width', width)
    .attr('height', height);

// Prepare the color scale
const color = d3.scaleQuantize()
    .domain([0, 10000])  // Assuming the maximum unemployment is 10,000 for the domain
    .range(d3.schemeSpectral[9]);

const tooltip = d3.select("#tooltip");

d3.json('LGA_VIC.json').then(json => {
    d3.csv("VIC_LGA_unemployment.csv").then(data => {
        const projection = d3.geoMercator()
            .fitSize([width, height], json);  // Fits the GeoJSON to our SVG dimensions

        const path = d3.geoPath().projection(projection);

        // Draw paths for each LGA once
        svg.selectAll('path')
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr("id", d => d.properties.LGA_name.replaceAll(" ", "_"))
            .attr('fill', 'grey'); // Default fill

        // Map unemployment data to paths
        data.forEach(row => {
            const feature = json.features.find(f => f.properties.LGA_name === row.LGA);
            if (feature) {
                const value = parseFloat(row.unemployed);
                const selector = "#" + feature.properties.LGA_name.replaceAll(" ", "_");
                
                svg.select(selector)
                    .attr('fill', color(value));  // Apply color based on the value
            }
        });

        // Optionally add cities
        d3.csv("VIC_CITY.csv").then(cityData => {
            svg.selectAll("circle")
                .data(cityData)
                .enter()
                .append("circle")
                .attr("cx", d => projection([+d.lon, +d.lat])[0])
                .attr("cy", d => projection([+d.lon, +d.lat])[1])
                .attr("r", 5)
                .attr("fill", "cyan")
                .style("opacity", 0.75)
                .on("mouseover", (event, d) => {
                    console.log(d['place']); // Check what data is being passed
                    tooltip.style("opacity", 1)
                        .html(d['place']);  // Ensure 'city' column exists and is accessed correctly
                })
                .on("mousemove", (event) => {
                    tooltip.style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 20) + "px");  // Move tooltip with mouse
                })
                .on("mouseout", () => {
                    tooltip.style("opacity", 0);  // Hide tooltip on mouseout
                });
        });
    });
});
