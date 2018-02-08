var data = [10, 15, 25, 120, 500, 980, 1200];

// Create yScale
var yScale = d3.scaleLinear()
    .domain([10, 1200])
    .range([0, 500]);

d3.select(".svg_histo")
    .selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("width", 30)
    .attr("height", function(d) { return yScale(d); })
    .attr("x", function(d, i) { return i * 30; })
    .attr("y", 0)
    .style("fill", "blue")
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", .25);