
draw_tot_pop_label();
draw_tot_pop();

draw_n_births_label();
draw_n_births();

draw_grid_onoff();

function draw_grid_onoff() {
    var grid_onoff = svg_little_charts.append("text") // insert grouping label
        .text("GRID HISTOGRAM:")
        .attr("dx", 30)
        .attr("dy", 500)
        .attr("class", "info_text");

    grid_onoff.transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition

    var grid_on = svg_little_charts.append("text") // insert grouping label
        .text("ON")
        .style("font-weight", "bold")
        .attr("dx", 170)
        .attr("dy", 500)
        .attr("class", "text_clickable_grid")
        .on("click", function () {
            grid = true;
            d3.selectAll(".grid_line").style("opacity", 1);
            d3.selectAll(".grid_label").style("opacity", 1);
            d3.select(this).style("font-weight", "bold");
            grid_off.style("font-weight", "normal");
        });

    grid_on.transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition

    var grid_off = svg_little_charts.append("text") // insert grouping label
        .text("OFF")
        .attr("dx", 200)
        .attr("dy", 500)
        .attr("class", "text_clickable_grid")
        .on("click", function () {
            grid = false;
            d3.selectAll(".grid_line").style("opacity", 0);
            d3.selectAll(".grid_label").style("opacity", 0);
            d3.select(this).style("font-weight", "bold");
            grid_on.style("font-weight", "normal");
        });

    grid_off.transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition
}

