var current_year_tot, current_value_tot;
[current_year_tot, current_value_tot] = draw_tot_pop_label();
draw_tot_pop();

var current_year_births, current_value_births;
[current_year_births, current_value_births] = draw_n_births_label();
draw_n_births();

draw_base_linegraph();

draw_grid_onoff();

function draw_base_linegraph() {
    var base_linegraph = svg_little_charts.append("text") // insert grouping label
        .text("BASE LINE GRAPHS:")
        .attr("dx", 40)
        .attr("dy", 530)
        .attr("class", "info_text");

    base_linegraph.transition().delay(800).duration(1000).style("opacity", 1); // on enter label transition

    var base_0 = svg_little_charts.append("text") // insert grouping label
        .text("0")
        .style("font-weight", "bold")
        .attr("dx", 180)
        .attr("dy", 530)
        .attr("class", "text_clickable_grid")
        .on("click", function () {
            base_line_tot = 0;
            base_line_births = 0;
            draw_tot_pop();
            draw_n_births();
            d3.select(this).style("font-weight", "bold");
            base_min.style("font-weight", "normal");
        });

    base_0.transition().delay(800).duration(1000).style("opacity", 1); // on enter label transition

    var base_min = svg_little_charts.append("text") // insert grouping label
        .text("MIN")
        .attr("dx", 210)
        .attr("dy", 530)
        .attr("class", "text_clickable_grid")
        .on("click", function () {
            base_line_tot = min_pop;
            base_line_births = min_born;
            draw_tot_pop();
            draw_n_births();
            d3.select(this).style("font-weight", "bold");
            base_0.style("font-weight", "normal");
        });

    base_min.transition().delay(800).duration(1000).style("opacity", 1); // on enter label transition
}

function draw_grid_onoff() {
    var grid_onoff = svg_little_charts.append("text") // insert grouping label
        .text("GRID HISTOGRAM:")
        .attr("dx", 40)
        .attr("dy", 560)
        .attr("class", "info_text");

    grid_onoff.transition().delay(900).duration(1000).style("opacity", 1); // on enter label transition

    var grid_on = svg_little_charts.append("text") // insert grouping label
        .text("ON")
        .style("font-weight", "bold")
        .attr("dx", 180)
        .attr("dy", 560)
        .attr("class", "text_clickable_grid")
        .on("click", function () {
            grid = true;
            d3.selectAll(".grid_line").style("opacity", 1);
            d3.selectAll(".grid_label").style("opacity", 1);
            d3.select(this).style("font-weight", "bold");
            grid_off.style("font-weight", "normal");
        });

    grid_on.transition().delay(900).duration(1000).style("opacity", 1); // on enter label transition

    var grid_off = svg_little_charts.append("text") // insert grouping label
        .text("OFF")
        .attr("dx", 210)
        .attr("dy", 560)
        .attr("class", "text_clickable_grid")
        .on("click", function () {
            grid = false;
            d3.selectAll(".grid_line").style("opacity", 0);
            d3.selectAll(".grid_label").style("opacity", 0);
            d3.select(this).style("font-weight", "bold");
            grid_on.style("font-weight", "normal");
        });

    grid_off.transition().delay(900).duration(1000).style("opacity", 1); // on enter label transition
}

function axis_approx(max) {
    var n_digits = max.toString().length;
    var first_digit = ('' + max)[0];
    num = first_digit;
    if (n_digits > 1) {
        var second_digit = ('' + max)[1];
        var num = Number(first_digit + second_digit);
    }
    var approx = num * Math.pow(10, (n_digits - 2));

    return approx;
}

function number_reduction(number) {
    var postfix = "";
    if (number >= 1000000) {
        number = number / 1000000;
        postfix = "M";
    } else if (number >= 1000) {
        number = number / 1000;
        postfix = "K";
    }
    return Math.round(number * 10) / 10 + postfix;
}

