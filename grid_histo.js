function create_grid_histo(svg_histo, pos, max, xScale) {

    var approx = axis_approx(max);

    var n_lines = 5;

    var x_line = new Array(n_lines);
    for (i = 0; i < n_lines; i++) {
        x_line[i] = xScale(Math.round(approx / n_lines * (i + 1)*10)/10);
    }

    var vertical = svg_histo.selectAll(".grid_line")
        .data(x_line);

    vertical.enter()
        .append("line")
        .attr("x1", function () {
            if (pos == "left") {
                return width / 2;
            } else {
                return 25;
            }
        })
        .attr("y1", 9)
        .attr("x2", function () {
            if (pos == "left") {
                return width / 2;
            } else {
                return 25;
            }
        })
        .attr("y2", 540)
        .attr("class", "grid_line");

    vertical.transition().delay(800).duration(1000)
        .style("opacity", 1)
        .attr("x1", function (d) {
            if (pos == "left") {
                return (width / 2 - d);
            } else {
                return 25 + d;
            }
        })
        .attr("x2", function (d) {
            if (pos == "left") {
                return (width / 2 - d);
            } else {
                return 25 + d;
            }
        });

    vertical.exit().transition().duration(500).remove(); // transition on exit

    var label = svg_histo.selectAll(".grid_label")
        .data(x_line);

    label.enter()
        .append("text")
        .attr("dx", function (d) {
            if (pos == "left") {
                return width / 2;
            } else {
                return 25;
            }
        })
        .attr("dy", 550)
        .attr("class", "grid_label");

    label.transition().delay(800).duration(1000)
        .style("opacity", 1)
        .attr("dx", function (d) {
            if (pos == "left") {
                return (width / 2 - d);
            } else {
                return 25 + d;
            }
        })
        .text(function (d, i) {
            var true_value = (approx / n_lines) * (i + 1);
            var postfix = "";
            if (true_value >= 1000000) {
                true_value = true_value /1000000;
                postfix = "M";
            }else if (true_value >= 1000) {
                true_value = true_value /1000;
                postfix = "K";
            }
            return Math.round(true_value*10)/10 + postfix;
        });

    label.exit().transition().duration(500).remove(); // transition on exit
}