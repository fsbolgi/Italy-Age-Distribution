var svg = d3.select(".svg_time"); // select correct svg
var points = [[35, 20], [window.innerWidth -60, 20]];


var line = svg.append("line") // draw line
    .attr("x1", points[0][0])
    .attr("y1", points[0][1])
    .attr("x2", points[1][0])
    .attr("y2", points[1][1])
    .attr("stroke-width", 2)
    .attr("stroke", "#464420");

var path = svg.append("path") // create path along the line
    .datum(points)
    .attr("d", d3.svg.line());

var drag = d3.behavior.drag() // function for dragging circle
    .on("drag", dragged);

function dragged() {
    var m = d3.mouse(svg.node()), // get mouse position in svg
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

function distance (p1, p2) { // compute distance from point and mouse position
    var dx = p1.x - p2[0],
        dy = p1.y - p2[1];
    return dx * dx + dy * dy;
}

var circle = svg.append("circle")
    .attr("transform", "translate(" + points[0] + ")")
    .attr("fill", "white")
    .attr("stroke", "#464420")
    .attr("r", 8)
    .call(drag);
