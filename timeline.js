var svg = d3.select(".svg_time"); // select correct svg

if (window.outerWidth < 640) { // compute position of line's ends
    var points = [[10, 25], [340, 25]];
} else {
    var points = [[40, 20], [40, 480]];
}

var line = svg.append("line") // draw line
    .attr("x1", points[0][0])
    .attr("y1", points[0][1])
    .attr("x2", points[1][0])
    .attr("y2", points[1][1])
    .attr("stroke-width", 2)
    .attr("stroke", "black");

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

function closestPoint(pathNode, point) {
    var pathLength = pathNode.getTotalLength(), // get path length
        precision = 2,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        scan = pathNode.getPointAtLength(scanLength);
        scanDistance = distance2(scan);
        if (scanDistance < bestDistance) {
            best = scan;
            bestLength = scanLength;
            bestDistance = scanDistance;
        }
    }

    // binary search for precise estimate
    precision /= 2;
    //while (precision > 0.5) {
        var before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
            best = before, bestLength = beforeLength, bestDistance = beforeDistance;
        } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
            best = after, bestLength = afterLength, bestDistance = afterDistance;
        } else {
            precision /= 2;
        }
    //}

    best = [best.x, best.y];
    best.distance = Math.sqrt(bestDistance);
    return best;

    function distance2(p) { // compute distance from point and mouse position
        var dx = p.x - point[0],
            dy = p.y - point[1];
        return dx * dx + dy * dy;
    }
}

var circle = svg.append("circle")
    .attr("transform", "translate(" + points[0] + ")")
    .attr("r", 7)
    .call(drag);
