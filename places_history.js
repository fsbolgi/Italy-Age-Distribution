var svg_places = d3.select(".places_history_svg"), // select correct svg
    x = 100,
    y = 10;
var grp = svg_places.append("g")
    .attr("transform", "translate(" + x + "," + y + ")");

grp.append("text")
    .text("ITALIA")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("class", "places_text");

function draw_arrow(el_name) {
    var line = svg_places.append("line") // draw line
        .attr("x1", x)
        .attr("y1", y+25)
        .attr("x2", x)
        .attr("y2", y+150)
        .attr("stroke-width", 0)
        .attr("stroke", "#696630")
        .transition()
        .duration(700)
        .attr("stroke-width", 1.7)
        .attr("marker-end", "url(#arrow)");

    y = y + 180;

    var grp = svg_places.append("g")
        .attr("transform", "translate(" + x + "," + y + ")");

    var min_font = 0;

    var place_name = grp.append("text")
        .text(extract_properties(el_name)[0].toUpperCase())
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("class", "places_text")
        .style("font-size", 1)
        .on("click", function () {
            d3.select(this).style("font-weight", "bold");
        });
    place_name.transition()
        .duration(700)
        .style("font-size", function (d) {
            min_font = Math.min(16, (200) / this.getComputedTextLength() * 0.55);
            return min_font + "pt";
        });
}