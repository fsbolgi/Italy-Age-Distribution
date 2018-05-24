function draw_magnifier() {
    var magnifier_circle = svg_places.append("circle")
        .attr("cx", 60)
        .attr("cy", 480)
        .attr("class", "magnifier_circle");

    var magnifier_line = svg_places.append("line")
        .attr("x1", 68)
        .attr("y1", 488)
        .attr("x2", 85)
        .attr("y2", 505)
        .attr("class", "magnifier_line");

    var magnifier_text = svg_places.append("text")
        .attr("dx", 90)
        .attr("dy", 490)
        .text("ZOOM OUT")
        .attr("class", "magnifier_text");

    magnifier_circle.transition().duration(1200).style("stroke", "#696630");
    magnifier_line.transition().duration(1200).style("stroke", "#696630");
    magnifier_text.transition().duration(1200).style("fill", "#696630");

    svg_places.append("rect")
        .attr("x", 50)
        .attr("y", 470)
        .attr("width", 36)
        .attr("height", 36)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out();
        });

    svg_places.append("rect")
        .attr("x", 90)
        .attr("y", 480)
        .attr("width", 72)
        .attr("height", 10)
        .attr("class", "magnifier_area")
        .on("click", function () {
            zoom_out();
        });
}