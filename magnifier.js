function draw_magnifier() {

    var magnifier_circle = svgA_header.append("circle") // draw magnifier icon
        .attr("cx", 630)
        .attr("cy", 30)
        .attr("class", "magnifier_circle");
    var magnifier_line = svgA_header.append("line")
        .attr("x1", 638)
        .attr("y1", 38)
        .attr("x2", 655)
        .attr("y2", 55)
        .attr("class", "magnifier_line");
    var magnifier_text = svgA_header.append("text")
        .attr("dx", 660)
        .attr("dy", 40)
        .text("ZOOM OUT")
        .attr("class", "info_text");

    magnifier_circle.transition().duration(1200).style("opacity", 1); // transitions on enter
    magnifier_line.transition().duration(1200).style("opacity", 1);
    magnifier_text.transition().duration(1200).style("opacity", 1);

    svgA_header.append("rect") // draw over the icon a clickable rectangle
        .attr("x", 620)
        .attr("y", 20)
        .attr("width", 36)
        .attr("height", 36)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out(level-1);
        });
    svgA_header.append("rect")
        .attr("x", 660)
        .attr("y", 30)
        .attr("width", 72)
        .attr("height", 10)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out(level-1);
        });
}