var age = [20, 40, 60, 80, 100, 120];
var nPeopleA = [8, 18, 30, 23, 12, 5, 2];
var nPeopleB = [6, 17, 22, 32, 14, 8, 5];
var width = 600;
var height = 550;
var svg_histoA = d3.select(".histoA_svg");
var svg_histoB = d3.select(".histoB_svg");

d3.csv("Data/Male/1982-ITALIA.csv", type, function (error, data) {
    console.log(data);
    var max = d3.max(data, function (d) {
        return d.value;
    });
    var xScale = d3.scale.linear()
        .domain([0, max])
        .range([0, width/2-30]);

    var bar_height = (height - 50) / data.length;

    svg_histoA.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", function (d) {
            return xScale(d.value);
        })
        .attr("height", bar_height)
        .attr("x", function (d) {
            return (width / 2 - (xScale(d.value) + 20));
        })
        .attr("y", function (d, i) {
            return i * (height) / data.length;
        })
        .on('mouseover', function (d) {
            d3.select(this).style("opacity", 1);
            svg_histoA.append("text")
                .text("value: " + d.value)
                .attr("dx", this.x.animVal.value + 35)
                .attr("dy", this.y.animVal.value + 15)
                .attr("class", "histo_label");
        })
        .on('mouseout', function (d) {
            d3.select(this).style("opacity", .6);
            svg_histoA.selectAll("text").remove();
        })
        .on("click", function (d) {
            console.log(d.value);
        });

    svg_histoB.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("width", function (d) {
            return xScale(d.value);
        })
        .attr("height", bar_height)
        .attr("x", 20)
        .attr("y", function (d, i) {
            return i * (height) / data.length;
        })
        .on('mouseover', function (d) {
            d3.select(this).style("opacity", 1);
            svg_histoB.append("text")
                .text("value: " + d.value)
                .attr("dx", this.x.animVal.value + 35)
                .attr("dy", this.y.animVal.value + 15)
                .attr("class", "histo_label");
        })
        .on('mouseout', function (d) {
            d3.select(this).style("opacity", .6);
            svg_histoB.selectAll("text").remove();
        })
        .on("click", function (d) {
            console.log(d.value);
        });
});

function type(d) {
    d.value = +d.IT;
    return d;
}
