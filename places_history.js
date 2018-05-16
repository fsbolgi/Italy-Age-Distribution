var svg_places = d3.select(".places_history_svg"), // select correct svg
    x = 90,
    y = 10;
var grp = svg_places.append("g")
    .attr("transform", "translate(" + x + "," + y + ")");

var ita = grp.append("text")
    .text("ITALIA")
    .style("fill", "#f7f6ee")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("class", "places_text_IT");

ita.transition().duration(1000).style("fill", "#696630");

function draw_arrow(el_name, level) {
    var line = svg_places.append("line") // draw line
        .attr("x1", x)
        .attr("y1", (y + 25 + 180 * level))
        .attr("x2", x)
        .attr("y2", (y + 150 + 180 * level))
        .attr("stroke-width", 0)
        .attr("stroke", "#696630")
        .transition()
        .duration(700)
        .attr("stroke-width", 1.7)
        .attr("marker-end", "url(#arrow)")
        .attr("class", "arrow "+ level);

    grp = svg_places.append("g")
        .attr("transform", "translate(" + x + "," + (y + 180 * (level + 1)) + ")");

    var min_font = 0;

    svg_places.selectAll("text").on("click", function () { // make previous levels
    });

    var place_name = grp.append("text")
        .text(extract_properties(el_name)[0].toUpperCase())
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("class", "places_text "+level)
        .style("font-size", 1)
        .on("click", function () {
            zoom_out();
        });
    place_name.transition()
        .duration(700)
        .style("font-size", function (d) {
            min_font = Math.min(16, (200) / this.getComputedTextLength() * 0.55);
            return min_font + "pt";
        });
}

function remove_level() {
    svg_places.selectAll(".arrow").remove();
    svg_places.selectAll(".places_text").remove();
}