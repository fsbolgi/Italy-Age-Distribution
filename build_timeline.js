function draw_years_rect() {
    time_line = svg_time.selectAll("rect") // draw a rectangle for each year
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
            return 1000 + i * 10;
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
}

function draw_epoc() {
    past = svg_time.append("text")
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
        .delay(1100)
        .duration(1000)
        .style("opacity", 1);

    future = svg_time.append("text")
        .text("FUTURE")
        .attr("dx", 440)
        .attr("dy", 10)
        .attr("class", "epoc_label")
        .attr("fill", "blue");
    future.transition()
        .delay(1350)
        .duration(1000)
        .style("opacity", 1);
}

function draw_years_label() {
    years_name = svg_time.selectAll("text")
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
        .attr("dy", 60)
        .attr("class", "year_label");
    years_name.transition()
        .duration(0)
        .delay(function (d, i) {
            return 1000 + i * 9;
        })
        .style("opacity", 1);
}

function draw_cursor() {
    div_cursor = d3.select('.timeline').append('div')
        .attr("class", "div_cursor")
        .attr("id", "div_cursor")
        .style("opacity", 0)
        .style('position', 'absolute')
        .style('top', 10 + "px")
        .style('left', 162 + "px")
        .style('width', 38 + "px")
        .style('height', 40 + "px");

    var svg_cursor = div_cursor.append("svg")
        .attr("width", 38 + "px")
        .attr("height", 40 + "px");
    svg_cursor.append("rect")
        .attr("transform", "translate(" + 15 + "," + 20 + ")")
        .attr("class", "cursor");

    text_cursor = svg_cursor.append("text")
        .text("1982")
        .attr("transform", "translate(" + 3 + "," + 15 + ")")
        .style("fill", "#696630")
        .style("opacity", 1);
}