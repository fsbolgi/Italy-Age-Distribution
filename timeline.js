var svg_time = d3.select(".time_svg"); // select correct svg
var points = [[35, 10], [585, 10]];
var line_width = 550;
var n_ages = 114;
var ages_array = new Array(114);
var curr_year = 1952;

for (i = 0; i <=n_ages; i++){
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
        return points[0][0] + line_width / n_ages *i;
    })
    .attr("y", points[0][1] + 2)
    .style("fill", function (d, i) {
        if (d <1982){
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
var present = svg_time.append("text")
    .text("PRESENT")
    .attr("dx", 230)
    .attr("dy", 10)
    .attr("class", "epoc_label")
    .attr("fill", "green");
var future = svg_time.append("text")
    .text("FUTURE")
    .attr("dx", 440)
    .attr("dy", 10)
    .attr("class", "epoc_label")
    .attr("fill", "blue");

var year_label = svg_time.selectAll("text")
    .data(ages_array)
    .enter()
    .append("text")
    .text(function(d){
        if (d%10==0){
            return d;
        } else {
            return "";
        }
    })
    .attr("dx", function(d, i){
        return points[0][0]-9 + line_width / n_ages *i;
    })
    .attr("dy", 40)
    .attr("class", "year_label");

var path = svg_time.append("path") // create path along the line
    .datum(points)
    .attr("d", d3.svg.line());

var drag = d3.behavior.drag() // function for dragging circle
    .on("drag", dragged);

function dragged() {
    var m = d3.mouse(svg_time.node()), // get mouse position in svg
        p = closestPoint(path.node(), m); // compute closest point in the path of the mouse position

    d3.select(this)
        .attr("transform", "translate(" + p[0] + "," + p[1] + ")") // move the circle
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
    .attr("transform", "translate(" + points[0] + ")")
    .attr("fill", "white")
    .attr("stroke", "#696630")
    .attr("width", line_width / n_ages)
    .attr("height", 20)
    .call(drag);
