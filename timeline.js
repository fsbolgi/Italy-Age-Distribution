var svg_time = d3.select(".time_svg"); // select correct svg
var points = [[35, 10], [582, 10]];
var line_width = 550;
var n_ages = 114;
var ages_array = new Array(114);
var curr_year = 1952;

for (i = 0; i <= n_ages; i++) {
    ages_array[i] = curr_year;
    curr_year++;
}

color_scale = time_color_scales();

var time_line = svg_time.selectAll("rect")
    .data(ages_array)
    .enter()
    .append("rect")
    .attr("width", line_width / n_ages - 1)
    .attr("height", 15)
    .attr("x", function (d, i) {
        return points[0][0] + line_width / n_ages * i;
    })
    .attr("y", points[0][1] + 2)
    .attr("id", function (d) {
        return "rect_time_" + d;
    })
    .style("fill", "#f7f6ee");
time_line.transition()
    .duration(0)
    .delay(function (d, i) {
        return 1000 + i * 8;
    })
    .style("fill", function (d, i) {
        if (d < 1982) {
            return color_scale[i];
        } else if (d < 2017) {
            return color_scale[i];
        } else {
            return color_scale[i];
        }
    });

var past = svg_time.append("text")
    .text("PAST")
    .attr("dx", 90)
    .attr("dy", 10)
    .attr("class", "epoc_label")
    .attr("fill", "orange");
past.transition()
    .delay(800)
    .duration(1000)
    .style("opacity", 1);
svg_time.append("text")
    .text("PRESENT")
    .attr("dx", 230)
    .attr("dy", 10)
    .attr("class", "epoc_label")
    .attr("fill", "green")
    .transition()
    .delay(1000)
    .duration(1000)
    .style("opacity", 1);
var future = svg_time.append("text")
    .text("FUTURE")
    .attr("dx", 440)
    .attr("dy", 10)
    .attr("class", "epoc_label")
    .attr("fill", "blue");
future.transition()
    .delay(1200)
    .duration(1000)
    .style("opacity", 1);

var years_name = svg_time.selectAll("text")
    .data(ages_array)
    .enter()
    .append("text")
    .text(function (d) {
        if (d % 10 == 0) {
            return d;
        } else {
            return "";
        }
    })
    .attr("dx", function (d, i) {
        return points[0][0] - 9 + line_width / n_ages * i;
    })
    .attr("dy", 40)
    .attr("class", "year_label");
years_name.transition()
    .duration(0)
    .delay(function (d, i) {
        return 1000 + i * 9;
    })
    .style("opacity", 1);

var path = svg_time.append("path") // create path along the line
    .datum(points)
    .attr("d", d3.svg.line());

var drag = d3.behavior.drag() // function for dragging circle
    .on("drag", dragged);

function dragged() {
    var m = d3.mouse(svg_time.node()), // get mouse position in svg
        p = closestPoint(path.node(), m); // compute closest point in the path of the mouse position

    d3.select(this)
        .attr("transform", "translate(" + p[0] + "," + p[1] + ")"); // move the circle

    year_modification = true;
    var pos = Math.round((p[0] - points[0][0]) * n_ages / line_width) + 1952;
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

var cursor = svg_time.append("rect")
    .attr("transform", "translate(" + 180 + "," + points[0][1] + ")")
    .attr("fill", "white")
    .attr("stroke", "#696630")
    .attr("width", line_width / n_ages + 4)
    .attr("height", 20)
    .style("opacity", 0)
    .call(drag)
    .transition()
    .delay(800)
    .duration(1000)
    .style("opacity", 1);


function disable_time_section() {
    time_line.transition()
        .duration(1000)
        .style("fill", function (d, i) {
            if (d < 1982) {
                return "#e0e0d1";
            } else if (d < 2017) {
                return color_scale[i];
            } else {
                return "#e0e0d1";
            }
        });

    past.transition()
        .duration(1000)
        .style("fill", "#e0e0d1");
    future.transition()
        .duration(1000)
        .style("fill", "#e0e0d1");
    years_name.transition()
        .duration(1000)
        .style("fill", function (d, i) {
            if (d < 1982) {
                return "#e0e0d1";
            } else if (d < 2017) {
                return color_scale[i];
            } else {
                return "#e0e0d1";
            }
        });

    points = [[180, 10], [339, 10]];
    path = svg_time.append("path") // create path along the line
        .datum(points)
        .attr("d", d3.svg.line());
}