var width = 600,
    height = 550,
    svg_histoA = d3.select(".histoA_svg"),
    svg_histoB = d3.select(".histoB_svg"),
    start = 2,
    ages_array = new Array(100),
    year_modification = false,
    group_by = 1,
    curr_max = 0,
    tooltip_histo,
    do_twice = 2;

draw_histo_label();

draw_histo(file_nameA, svg_histoA, "left");
draw_histo(file_nameB, svg_histoB, "right");

function draw_histo(path_data, svg_histo, pos) {

    d3.csv(path_data, type, function (error, data) {

        var data_grouped = compute_grouping(data);

        var tot_pop = d3.sum(data, function (d) {
            return d.value;
        });

        curr_max = compute_max(data);

        var xScale = d3.scale.linear()
            .domain([0, curr_max])
            .range([0, width / 2 - 45]);

        var bar_height = (height - 30) * group_by / ages_array.length;

        var mean = compute_mean_age(data, tot_pop);

        if (!year_modification && grid) {
            create_grid_histo(svg_histo, pos, curr_max, xScale);
        }
        draw_rectangles(svg_histo, pos, data_grouped, mean, xScale, bar_height, tot_pop, ("rect_histo_" + pos));
    });
}

function compute_max(data) { // compute the max of the whole file
    var curr_max = 0;
    var save_col_name = col_name;
    var max = 0;

    var cols = d3.keys(data[0]);

    for (i = 1; i < cols.length - 1; i++) {
        col_name = cols[i];
        data.forEach(function (d) {
            d.col = +d[col_name];
        });

        max = d3.max(data, function (d) {
            return d.col;
        });
        if (max > curr_max) {
            curr_max = max;
        }
    }
    col_name = save_col_name;
    return curr_max * group_by;
}

function compute_grouping(data) {
    var data_grouped = new Array(100 / group_by);
    for (i = 0; i < (100 / group_by); i++) {
        data_grouped[i] = 0;
    }
    var c = 0;
    for (i = 0; i < 100; i++) {
        data_grouped[c] = data_grouped[c] + data[i].value;
        if ((i + 1) % group_by == 0) {
            c++;
        }
    }
    return data_grouped;
}

function draw_rectangles(svg_histo, pos, data_grouped, mean, xScale, bar_height, tot_pop, class_r) {
    var rect = svg_histo.selectAll("." + class_r)
        .data(data_grouped);

    rect.enter() // insert histogram bars
        .append("rect")
        .attr("width", 0)
        .attr("x", function () {
            if (pos == "left") {
                return 300;
            } else {
                return 25;
            }
        })
        .attr("class", class_r); /////////left and right, create css per hover

    rect.transition() // transition on enter or on update
        .delay(function (d, i) {
            return (start > 0) ? (800 + i * 7) : 0;
        })
        .duration(function () {
            return year_modification ? 100 : 1000;
        })
        .style("fill", function (d, i) {
            if (i == mean) {
                if (class_r.substring(5, 10) == "hover") {
                    return (pos == "left") ? "#152837" : "#e67364";
                } else {
                    return (pos == "left") ? "#265073" : "#f07e6f";
                }
            }
        })
        .attr("width", function (d) {
            return xScale(d);
        })
        .attr("height", bar_height)
        .attr("x", function (d) {
            if (pos == "left") {
                return (width / 2 - (xScale(d)));
            } else {
                return 25;
            }
        })
        .attr("y", function (d, i) {
            return i * (height - 20) / data_grouped.length + 10;
        });

    rect.exit().transition().duration(150).remove(); // transition on exit

    if (!year_modification) {
        start--;
    }

    rect.on('mouseover', function () {
        d3.select(this).style("opacity", 1);
        tooltip_histo.style("visibility", "visible");
    })
        .on('mouseout', function () {
            d3.select(this).style("opacity", .7);
            tooltip_histo.style("visibility", "hidden");
        })
        .on("mousemove", function (d, i) {
            tooltip_histo.style("top", (event.pageY - 15) + "px")
                .style("left", (event.pageX + 17) + "px");
            var age_value = i;
            if (group_by > 1) {
                age_value = Math.round(i * group_by) + " - " + Math.round(i * group_by + group_by - 1);
            }
            var tool_string = "&nbsp<strong>Age:</strong> " + age_value + "<br>" +
                "&nbsp<strong>Value:</strong> " + d + "<br>" +
                "&nbsp<strong>Rate:</strong> " + Math.round((d * 10000 / tot_pop)) / 100 + "%";
            (i == mean) ? tool_string = "&nbsp<strong>AVERAGE AGE</strong><br>" + tool_string : 0;
            tooltip_histo.html(tool_string);
        });
}

function compute_mean_age(data, tot_pop) {
    var tot_pop_weighted = d3.sum(data, function (d, i) {
        return d.value * (ages_array[i] + 1);
    });
    return Math.floor((tot_pop_weighted / tot_pop - 1) / group_by);
}

function zoom_in_histo(curr_el) {
    year_modification = false;
    var el_name = extract_properties(curr_el)[0].toUpperCase();
    if (el_name.indexOf("/") != -1) {
        el_name = el_name.substring(0, el_name.indexOf("/")).trim();
    }
    if (level == 2) { // if there's a mun with the same name of a province
        el_name = el_name + "_mun";
    }

    file_nameA = "Data/Male/" + el_name + ".csv";
    file_nameB = "Data/Female/" + el_name + ".csv";
    draw_histo(file_nameA, svg_histoA, "left");
    draw_histo(file_nameB, svg_histoB, "right");
}

function draw_hover_histo(path_data, svg_histo, pos) {
    var y = col_name.substring(2, col_name.length);
    if (level > 0 && (y < 1982 || y > 2017)) {
    } else {
        d3.csv(path_data, type, function (error, data) {
            if (!error) {

                var data_grouped = compute_grouping(data);

                var tot_pop = d3.sum(data, function (d) {
                    return d.value;
                });

                var xScale = d3.scale.linear()
                    .domain([0, curr_max])
                    .range([0, width / 2 - 45]);

                var bar_height = (height - 30) * group_by / ages_array.length;

                var mean = compute_mean_age(data, tot_pop);

                draw_rectangles(svg_histo, pos, data_grouped, mean, xScale, bar_height, tot_pop, ("rect_hover_histo_" + pos));
            }
        });
    }
}