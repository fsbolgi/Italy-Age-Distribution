var svg_time = d3.select(".time_svg"), // select correct svg
    points = [[35, 30], [582, 30]],
    line_width = 550,
    n_ages = 114,
    ages_array = new Array(114),
    curr_year = 1952,
    time_line,
    past,
    future,
    years_name,
    div_cursor,
    text_cursor;

for (i = 0; i <= n_ages; i++) {
    ages_array[i] = curr_year + i;
}

color_scale = time_color_scales();

draw_years_rect();
draw_epoc();
draw_years_label();
draw_cursor();

var path = svg_time.append("path") // create path along the line
    .datum(points)
    .attr("d", d3.svg.line());

var drag = d3.behavior.drag() // function for dragging circle
    .on("drag", dragged);

div_cursor.call(drag)
    .transition()
    .delay(800)
    .duration(1000)
    .style("opacity", 1);

function dragged() {
    var m = d3.mouse(svg_time.node()), // get mouse position in svg
        p = closestPoint(path.node(), m); // compute closest point in the path of the mouse position

    year_modification = true;
    var pos = Math.round((p[0] - points[0][0]) * n_ages / line_width);
    (level <= 1) ? pos = pos + 1952 : pos = pos + 1982;

    div_cursor.style('left', p[0] - 16 + "px");
    text_cursor.text(pos);
    set_col_name("A_" + pos);
    draw_histo(file_nameA, svg_histoA, "left");
    draw_histo(file_nameB, svg_histoB, "right");
}

function closestPoint(pathNode, point) { // compute closest point in the path from a point
    var pathLength = pathNode.getTotalLength(), // get path length
        best, // best point
        bestLength, //best length in the path
        bestDistance = Infinity, // best distance from path
        curr_point, // current position in the path
        curr_distance; // current distance from path

    // linear scan for coarse approximation
    for (var curr_length = 0; curr_length <= pathLength; curr_length++) {
        curr_point = pathNode.getPointAtLength(curr_length); // scan is a point in the path at distance scanLength
        curr_distance = distance(curr_point, point); // compute the distance from mouse position and scan
        if (curr_distance < bestDistance) {
            best = curr_point; // update best point in path
            bestLength = curr_length; // update length in path
            bestDistance = curr_distance; // update distance
        }
    }
    return [best.x, best.y];
}

function distance(p1, p2) { // compute distance from point and mouse position
    var dx = p1.x - p2[0],
        dy = p1.y - p2[1];
    return dx * dx + dy * dy;
}

function disable_time_section(disable) {
    time_line.transition()
        .duration(1000)
        .style("fill", function (d, i) {
            if (d < 1982 || d > 2017) {
                return disable ? "#e0e0d1" : color_scale[i];
            } else {
                return color_scale[i];
            }
        });

    past.transition()
        .duration(1000)
        .style("fill", function () {
            return disable ? "#e0e0d1" : "orange";
        });
    future.transition()
        .duration(1000)
        .style("fill", function () {
            return disable ? "#e0e0d1" : "blue";
        });
    years_name.transition()
        .duration(1000)
        .style("fill", function (d, i) {
            if (d < 1982 || d > 2017) {
                return disable ? "#e0e0d1" : 696630;
            } else {
                return color_scale[i];
            }
        });

    if (disable) {
        points = [[180, 10], [348, 10]];
    } else {
        points = [[35, 10], [582, 10]];
    }

    path = svg_time.append("path") // create path along the line
        .datum(points)
        .attr("d", d3.svg.line());

    var pos = document.getElementById("div_cursor").style.left;
    pos = pos.substring(0, pos.length - 2);
    if (pos > 342) {
        pos = 332;
        text_cursor.text("2017");
        set_col_name("A_2017");
        draw_histo(file_nameA, svg_histoA, "left");
        draw_histo(file_nameB, svg_histoB, "right");
    } else if (pos < 180) {
        pos = 162;
        text_cursor.text("1982");
        set_col_name("A_1982");
        draw_histo(file_nameA, svg_histoA, "left");
        draw_histo(file_nameB, svg_histoB, "right");
    }

    div_cursor.style('left', pos + "px");
}