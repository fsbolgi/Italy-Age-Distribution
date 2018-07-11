var timer,
    timer_still = true;

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

    time_line.on("click", function () {
        console.log(this)
    });
}

function draw_epoc() {
    past = svg_time.append("text")
        .text("PAST")
        .attr("dx", 90)
        .attr("dy", 10)
        .attr("class", "epoc_label")
        .attr("fill", "#f3b748");
    past.transition()
        .delay(800)
        .duration(1000)
        .style("opacity", 1);

    svg_time.append("text")
        .text("PRESENT")
        .attr("dx", 230)
        .attr("dy", 10)
        .attr("class", "epoc_label")
        .attr("fill", "#62cc9a")
        .transition()
        .delay(1100)
        .duration(1000)
        .style("opacity", 1);

    future = svg_time.append("text")
        .text("FUTURE")
        .attr("dx", 440)
        .attr("dy", 10)
        .attr("class", "epoc_label")
        .attr("fill", "#388393");
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
        .attr("class", "year_label")
        .style("fill", function (d, i) {
            return color_scale[i];
        });
    years_name.transition()
        .duration(0)
        .delay(function (d, i) {
            return 1000 + i * 9;
        })
        .style("opacity", 1);

    var xScale = d3.scale.linear()
        .domain([3, 20])
        .range([0, 25]);

    var yScale = d3.scale.linear()
        .domain([0, 20])
        .range([22, 57]);

    var trianglePoints = xScale(3) + ' ' + yScale(15) + ', ' + xScale(3) + ' ' + yScale(5) + ', ' + xScale(9) + ' ' + yScale(10) + ' ' + xScale(9) + ', ' + yScale(10) + ' ' + xScale(3) + ' ' + yScale(15);

    var play = svg_time.append('polyline')
        .attr('points', trianglePoints)
        .attr("class", "play");
    play.transition().delay(1000).duration(1000).style("opacity", 1);
    play.on("click", function () {
        if (timer_still) {
            timer_still = false;
            timer = setInterval(function () {
                play_timeline();
            }, 5 * 50);
        }
    });

    svg_time.append("line")
        .attr("x1", 18)
        .attr("y1", 33)
        .attr("x2", 18)
        .attr("y2", 48)
        .attr("class", "pause")
        .transition().delay(1000).duration(1000).style("opacity", 1);

    svg_time.append("line")
        .attr("x1", 23)
        .attr("y1", 33)
        .attr("x2", 23)
        .attr("y2", 48)
        .attr("class", "pause")
        .transition().delay(1000).duration(1000).style("opacity", 1);

    svg_time.append("rect")
        .attr("x", 17)
        .attr("y", 33)
        .attr("width", 10)
        .attr("height", 15)
        .style("fill", "transparent")
        .style("cursor", "pointer")
        .on("click", function () {
            clearInterval(timer);
            timer_still = true;
        });

}

function play_timeline() {
    var pos = document.getElementById("div_cursor").style.left;
    pos = Number(pos.substring(0, pos.length - 2));
    var movement = line_width / n_ages;
    year_modification = true;
    if ((pos + movement) < points[1][0] - 16) {
        div_cursor.style('left', (pos + movement) + "px");
        var year = Number(text_cursor[0][0].textContent) + 1;
        move_index_tot_pop(year);
        move_index_n_births(year);
        text_cursor.text(year);
        set_col_name("A_" + year);
        compute_mean(curr_el, element.features);
        draw_histo(file_nameA, svg_histoA, "left");
        draw_histo(file_nameB, svg_histoB, "right");
    } else {
        clearInterval(timer);
        timer_still = true;
    }
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