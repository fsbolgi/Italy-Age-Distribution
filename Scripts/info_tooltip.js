function insert_info_tooltip() {

    var info_i = svgB_header.append("text") // draw the icon
        .text("i")
        .attr("fill", "#f7f6ee")
        .attr("dx", 700)
        .attr("dy", 52)
        .attr("class", "info_i");
    var info_circle = svgB_header.append("circle")
        .attr("cx", 703)
        .attr("cy", 45)
        .attr("class", "info_button")
        .on("click", function () {
            on();
        });

    info_i.transition().delay(800).duration(1000).style("opacity", 1); // on enter label transition
    info_circle.transition().delay(800).duration(1000).style("opacity", 1); // on enter values transition
}