function draw_group_ages() {

    var group_options = [1, 2, 5, 10, 20, 25]; //grouping options

    var options_name = svgB_header.selectAll("text") // append grouping values
        .data(group_options)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("dx", function (d, i) {
            var x = 280 + i * 20
            return (d > 10) ? x + 6 * (i - 3) : x;
        })
        .attr("dy", 55)
        .attr("class", "text_clickable_grp")
        .attr("id", function (d) {
            return "grp" + d;
        });

    d3.select("#grp1").style("font-weight", "bold"); // make group in 1 selected

    options_name.on("click", function (d) { // on click change grouping
        d3.selectAll(".text_clickable_grp")
            .style("font-weight", "normal");
        d3.select("#grp" + d).style("font-weight", "bold");
        group_ages(d);
    });

    var label_group = svgB_header.append("text") // insert grouping label
        .text("GROUP AGES IN:")
        .attr("dx", 290)
        .attr("dy", 35)
        .attr("class", "info_text");

    label_group.transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition
    options_name.transition().delay(500).duration(1000).style("opacity", 1); // on enter values transition
}

function group_ages(grp) { // redraw the histogram changing the grouping options
    group_by = grp;
    year_modification = false;
    draw_histo(file_nameA, svg_histoA, "left");
    draw_histo(file_nameB, svg_histoB, "right");
}