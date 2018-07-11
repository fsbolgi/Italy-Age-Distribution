var svgA_header = d3.select(".headerA_svg"),
    svgB_header = d3.select(".headerB_svg"),
    place_x = 15,
    place_y = 65; // select correct svg

draw_group_ages();
draw_magnifier();
insert_info_tooltip ();

svgA_header.append("text")
    .text("AGE DISTRIBUTION")
    .attr("dx", place_x)
    .attr("dy", 35)
    .attr("class", "header_label");

var place = svgA_header.append("text")
    .text("ITALIA")
    .attr("dx", place_x)
    .attr("dy", place_y)
    .attr("class", "places_text")
    .attr("id", "places_text_0")
    .on("click", function () {
        zoom_out(0);
    });
place_x = 65;

place.transition().duration(1000).style("opacity", 1);

function write_next_place(el_name, level) {
    var min_font = 0;

    var curr_place = svgA_header.append("text")
        .text("> " + extract_properties(el_name)[0].toUpperCase())
        .attr("dx", function () {
            var x = place_x;
            if (level != 2) {
                place_x = place_x + this.getComputedTextLength();
            }
            return x;
        })
        .attr("dy", place_y)
        .attr("class", "places_text")
        .attr("id", "places_text_" + (Number(level)+1))
        .style("font-size", 1);
    curr_place.transition()
        .duration(1000)
        .style("font-size", function (d) {
            min_font = 11;
            return min_font + "pt";
        })
        .style("opacity", 1);
    curr_place.on("click", function () {
        zoom_out(level+1);
    });
}
