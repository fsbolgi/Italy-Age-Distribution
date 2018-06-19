var width = 600,
    height = 550,
    svg_histoA = d3.select(".histoA_svg"),
    svg_histoB = d3.select(".histoB_svg"),
    start = 2,
    ages_array = new Array(100),
    year_modification = false;

for (i = 0; i <= 100; i++) {
    ages_array[i] = i;
}

var ages_name = svg_histoB.selectAll("text")
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
    .attr("dx", function (d) {
        if (d == 0) {
            return 10;
        } else if (d == 100) {
            return 4;
        }else {
            return 7;
        }
    })
    .attr("dy", function (d, i) {
        return 5.3 * i + 17;
    })
    .attr("class", "year_label");
ages_name.transition()
    .duration(0)
    .delay(function (d, i) {
        return 1000 + i * 9;
    })
    .style("opacity", 1);

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("visibility", "hidden");

var col_name = "A_1982",
    file_nameA = "Data/Male/ITALIA.csv",
    file_nameB = "Data/Female/ITALIA.csv";

draw_histo(file_nameA, svg_histoA, "left");
draw_histo(file_nameB, svg_histoB, "right");

function set_col_name(new_col_name) {
    col_name = new_col_name;
}

function draw_histo(path_data, svg_histo, pos) {

    d3.csv(path_data, type, function (error, data) {

        var tot_pop = d3.sum(data, function (d) {
            return d.value;
        });

        curr_max = 0;
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

        var xScale = d3.scale.linear()
            .domain([0, curr_max])
            .range([0, width / 2 - 10]);

        var bar_height = (height-30) / ages_array.length;

        var rect = svg_histo.selectAll("rect")
            .data(data);

        rect.enter()
            .append("rect")
            .attr("width", 0)
            .attr("height", bar_height)
            .attr("x", function (d) {
                if (pos == "left") {
                    return 275;
                } else {
                    return 40;
                }
            })
            .attr("y", function (d, i) {
                return i * (height-20) / data.length + 10;
            });

        rect.transition()
            .delay(function () {
                return (start > 0) ? 800 : 0;
            })
            .duration(function () {
                return year_modification ? 100 : 1000;
            })
            .attr("width", function (d) {
                return xScale(d.value);
            })
            .attr("x", function (d) {
                if (pos == "left") {
                    return (width / 2 - (xScale(d.value)));
                } else {
                    return 25;
                }
            });
        if (!year_modification) {
            start--;
        }

        rect.on('mouseover', function () {
            d3.select(this).style("opacity", 1);
            tooltip.style("visibility", "visible");
        })
            .on('mouseout', function () {
                d3.select(this).style("opacity", .7);
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function (d, i) {
                tooltip.style("top", (event.pageY - 15) + "px")
                    .style("left", (event.pageX + 17) + "px")
                    .html("&nbsp<strong>Age:</strong> " + i + "<br>" +
                        "&nbsp<strong>Value:</strong> " + d.value + "<br>" +
                        "&nbsp<strong>Rate:</strong> " + Math.round((d.value * 10000 / tot_pop)) / 100 + "%");
            });
    });
}

function type(d) {
    d.value = +d[col_name];
    return d;
}