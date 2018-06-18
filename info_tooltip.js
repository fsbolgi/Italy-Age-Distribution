function insert_info_tooltip (svg, info_text) {
    var info_tool = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

    svg.append("text")
        .text("i")
        .attr("fill", "#f7f6ee")
        .attr("dx", 28)
        .attr("dy", 14)
        .attr("class", "info_i");
    svg.append("circle")
        .attr("cx", 30)
        .attr("cy", 10)
        .attr("class", "info_button")
        .on('mouseover', function (d) {
            info_tool.style("visibility", "visible");
        })
        .on('mouseout', function (d) {
            info_tool.style("visibility", "hidden");
        })
        .on("mousemove", function (d, i) {
            info_tool.style("top", (event.pageY - 15) + "px")
                .style("left", (event.pageX + 17) + "px")
                .html(info_text);
        });
}