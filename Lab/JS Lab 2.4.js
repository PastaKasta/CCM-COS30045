function init(){
    //reading the data from csv file
    d3.csv("Task_2.4_data.csv").then(function(data){
        console.log(data);
        CatSightings = data;

        barChart(CatSightings);
    })
    
    var w = 500;
    var h = 150;
    var barPadding = 3;

    //D3 block
    var svg = d3.select("#chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);

    function barChart(CatSightings)
    {
        svg.selectAll("rect")
        .data(CatSightings)
        .enter()
        .append("rect")
        //x coordinate and y coordinate
        .attr("x",function(d,i){
            return i * (w/CatSightings.length);
        })
        .attr("y",function(d){
            return h - (d.Cat*4)
        })
        //width and height of the bar chart
        .attr("width",function(d){
            return (w/CatSightings.length-barPadding);
        })
        .attr("height",function(d){
            return d.Cat*4;
        })
        //colour of the bar changes depending on the value of the data
        .attr("fill", function(d) {
                return "rgb(135,206, " + (d.Cat * 8) + ")";
        });

        svg.selectAll("text")
        .data(CatSightings)
        .enter()
        .append("text")
        .text(function(d) {
            return d.Cat;
        })
        .attr("fill","black")
        .attr("x", function(d, i) {
            return i * (w / CatSightings.length) +10.5;
        })
        .attr("y",function(d){
            return h - (d.Cat *4)
        })
    }
}
window.onload = init;
