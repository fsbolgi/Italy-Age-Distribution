var age = [20, 40, 60, 80, 100, 120];
var nPeopleA = [8, 18, 23, 12, 5, 2];
var nPeopleB = [6, 17, 22, 14, 8, 5];

d3.tsv("2011.tsv", type, function(error, data) {
    x.domain([0, d3.max(data, function(d) { return d.value; })]);

var xScale = d3.scaleLinear()
    .domain([0, 23])
    .range([0, 210])

var barA = d3.select(".svg_histoA")
    .selectAll("rect")
    .data(nPeopleA)
    .enter();

barA.append("rect")
    .attr("width", function(d) { return xScale(d); })
    .attr("height", 50)
    .attr("x", function(d){ return (220-xScale(d)); })
    .attr("y", function(d, i) { return i * 50; })
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", .25);

barA.append("text")
    .data(age)

d3.select(".svg_histoB")
    .selectAll("rect")
    .data(nPeopleB)
    .enter()
    .append("rect")
    .attr("width", function(d) { return xScale(d); })
    .attr("height", 50)
    .attr("x", 30)
    .attr("y", function(d, i) { return i * 50; })
    .style("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", .25);