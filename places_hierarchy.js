var svg_places = d3.select(".places_hierarchy_svg"); // select correct svg

var grp = svg_places.append("g")
    .attr("transform","translate(100,20)");

grp.append("text")
    .text("ITALIA")
    .attr("text-anchor", "middle")
    .attr("dy", ".35em")
    .attr("class", "places_text");

function draw_arrow(region_name){
    var line = svg_places.append("line") // draw line
        .attr("x1", 100)
        .attr("y1", 45)
        .attr("x2", 100)
        .attr("y2", 170)
        .attr("stroke-width", 0)
        .attr("stroke", "#696630")
        .transition()
            .duration(700)
            .attr("stroke-width", 1.7)
        .attr("marker-end","url(#arrow)");

    var grp = svg_places.append("g")
        .attr("transform","translate(100, 200)");

    grp.append("text")
        .text(region_name.properties.NOME_REG)
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("class", "places_text")
        .style("font-size", 1)
        .transition()
            .duration(700)
            .style("font-size", function(d) {
                var min_font = Math.min(16, (200) / this.getComputedTextLength() * 0.55);
                return min_font + "pt";
            });
}