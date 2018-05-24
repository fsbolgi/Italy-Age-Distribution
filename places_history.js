var svg_places = d3.select(".places_history_svg"), // select correct svg
    x = 40,
    y = 40;

var place = svg_places.append("text")
    .text("ITALIA")
    .attr("dx", x)
    .attr("dy", y)
    .attr("class", "places_text_IT");

place.transition().duration(1000).style("opacity", 1);

draw_magnifier();

function draw_arrow(el_name, level) {
    var min_font = 0;

    place = svg_places.append("text")
        .text("> " +extract_properties(el_name)[0].toUpperCase())
        .attr("dx", x)
        .attr("dy", (y + 40 * (level + 1)))
        .attr("class", "places_text "+level)
        .style("font-size", 1);
    place.transition()
        .duration(1000)
        .style("font-size", function (d) {
            min_font = Math.min(14, (200) / this.getComputedTextLength() * 0.55);
            return min_font + "pt";
        })
        .style("opacity", 1);
}

function remove_level() {
    svg_places.selectAll(".arrow").remove();
    svg_places.selectAll(".places_text").remove();
}