const width = 800, height = 600;
        
// SVG canvas setup
const svg = d3.select('body').append('svg')
              .attr('width', width)
              .attr('height', height);

// Load GeoJSON data
d3.json('LGA_VIC.json').then(geoData => {
    // Get bounds and adjust projection
    const bounds = d3.geoBounds(geoData);
    const center = [(bounds[0][0] + bounds[1][0]) / 2, (bounds[0][1] + bounds[1][1]) / 2];

    const projection = d3.geoMercator()
                         .center(center)
                         .scale(6000)  // Adjust scale as needed
                         .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Draw paths for each LGA
    svg.selectAll('path')
       .data(geoData.features)
       .enter()
       .append('path')
       .attr('d', path)
       .attr('stroke', 'black')
       .attr('fill', 'lightblue');  // Temporary fill to ensure visibility
}).catch(error => console.error('Error loading the GeoJSON file:', error));
