function draw_magnifier() {

    var magnifier_circle = svgA_header.append("circle") // draw magnifier icon
        .attr("cx", 640)
        .attr("cy", 30)
        .attr("class", "magnifier_circle");
    var magnifier_line = svgA_header.append("line")
        .attr("x1", 648)
        .attr("y1", 38)
        .attr("x2", 665)
        .attr("y2", 55)
        .attr("class", "magnifier_line");
    var magnifier_text = svgA_header.append("text")
        .attr("dx", 670)
        .attr("dy", 40)
        .text("ZOOM OUT")
        .attr("class", "magnifier_text");

    magnifier_circle.transition().duration(1200).style("opacity", 1); // transitions on enter
    magnifier_line.transition().duration(1200).style("opacity", 1);
    magnifier_text.transition().duration(1200).style("opacity", 1);

    svgA_header.append("rect") // draw over the icon a clickable rectangle
        .attr("x", 630)
        .attr("y", 40)
        .attr("width", 36)
        .attr("height", 36)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out();
        });
    svgA_header.append("rect")
        .attr("x", 670)
        .attr("y", 30)
        .attr("width", 72)
        .attr("height", 10)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out();
        });
}