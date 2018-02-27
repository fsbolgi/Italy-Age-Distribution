var age = [20, 40, 60, 80, 100, 120];
var nPeopleA = [8, 18, 23, 12, 5, 2];
var nPeopleB = [6, 17, 22, 14, 8, 5];

function screen_width() {
    if (window.outerWidth < 640)
        return 350;
    else
        return 500;
}

///////// TODO read data from csv

var xScale = d3.scale.linear()
    .domain([0, 23])
    .range([0, screen_width()/2-30])

d3.select(".svg_histoA")
    .selectAll("rect")
    .data(nPeopleA)
        .enter()
            .append("rect")
            .attr("width", function(d) { return xScale(d); })
            .attr("height", (screen_width()-50)/nPeopleA.length)
            .attr("x", function(d){ return (screen_width()/2-(xScale(d)+20)); })
            .attr("y", function(d, i) { return i * (screen_width())/nPeopleA.length; })
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", .25);

d3.select(".svg_histoB") // where we want to create the histogram
    .selectAll("rect") // select all rectangles (even if not present)
    .data(nPeopleB) // you pass the array, everything later will be executed for each element
        .enter() // what do do if rect is missing
            .append("rect") // insert new rectangle
            .attr("width", function(d) { return xScale(d); }) //width of the rect
            .attr("height", (screen_width()-50)/nPeopleB.length) //height of the rect
            .attr("x", 20) // position on x coord
            .attr("y", function(d, i) { return i * (screen_width())/nPeopleB.length; }) // position on y coord
                        // this function takes as first input the data element and as second the index
            .style("stroke", "black")
            .style("stroke-width", "1px")
            .style("opacity", .25);

