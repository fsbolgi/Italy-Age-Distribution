function draw_magnifier() {

    var magnifier_circle = svgB_header.append("circle") // draw magnifier icon
        .attr("cx", 30)
        .attr("cy", 30)
        .attr("class", "magnifier_circle");
    var magnifier_line = svgB_header.append("line")
        .attr("x1", 38)
        .attr("y1", 38)
        .attr("x2", 55)
        .attr("y2", 55)
        .attr("class", "magnifier_line");
    var magnifier_text = svgB_header.append("text")
        .attr("dx", 60)
        .attr("dy", 40)
        .text("ZOOM OUT")
        .attr("class", "info_text_header");

    magnifier_circle.transition().duration(1200).style("opacity", 1); // transitions on enter
    magnifier_line.transition().duration(1200).style("opacity", 1);
    magnifier_text.transition().duration(1200).style("opacity", 1);

    svgB_header.append("rect") // draw over the icon a clickable rectangle
        .attr("x", 20)
        .attr("y", 20)
        .attr("width", 36)
        .attr("height", 36)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out(level-1);
        });
    svgB_header.append("rect")
        .attr("x", 60)
        .attr("y", 30)
        .attr("width", 72)
        .attr("height", 10)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out(level-1);
        });
}