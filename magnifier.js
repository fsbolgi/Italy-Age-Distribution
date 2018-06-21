function draw_magnifier() {

    var magnifier_circle = svg_places.append("circle") // draw magnifier icon
        .attr("cx", 40)
        .attr("cy", 460)
        .attr("class", "magnifier_circle");
    var magnifier_line = svg_places.append("line")
        .attr("x1", 48)
        .attr("y1", 468)
        .attr("x2", 65)
        .attr("y2", 485)
        .attr("class", "magnifier_line");
    var magnifier_text = svg_places.append("text")
        .attr("dx", 70)
        .attr("dy", 470)
        .text("ZOOM OUT")
        .attr("class", "magnifier_text");

    magnifier_circle.transition().duration(1200).style("opacity", 1); // transitions on enter
    magnifier_line.transition().duration(1200).style("opacity", 1);
    magnifier_text.transition().duration(1200).style("opacity", 1);

    svg_places.append("rect") // draw over the icon a clickable rectangle
        .attr("x", 30)
        .attr("y", 450)
        .attr("width", 36)
        .attr("height", 36)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out();
        });
    svg_places.append("rect")
        .attr("x", 70)
        .attr("y", 460)
        .attr("width", 72)
        .attr("height", 10)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out();
        });
}