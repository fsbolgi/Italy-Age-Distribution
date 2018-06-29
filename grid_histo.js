function create_grid_histo(svg_histo, pos, max, xScale) {

    var n_digits = max.toString().length;
    var first_digit = ('' + max)[0];
    var second_digit = ('' + max)[1];
    var num = Number(first_digit + second_digit);
    var approx = num * Math.pow(10, (n_digits - 2));
    var n_lines = 5;

    var x_line = new Array(n_lines);
    for (i = 0; i < n_lines; i++) {
        x_line[i] = xScale(approx / n_lines * (i + 1));
    }

    var vertical = svg_histo.selectAll(".grid_line")
        .data(x_line);

    vertical.enter()
        .append("line")
        .attr("x1", function (d) {
            if (pos == "left") {
                return width / 2;
            } else {
                return 25;
            }
        })
        .attr("y1", 9)
        .attr("x2", function (d) {
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
        .text(function (d, i) {
            return (approx / n_lines * (i + 1));
        })
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
            return Math.round((approx / n_lines) * (i + 1)*10)/10;
        });

    label.exit().transition().duration(500).remove(); // transition on exit

    var line_top_h = svg_histo.append("line");

}