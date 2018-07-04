var new_borns,
    min_born,
    max_born,
    base_line_births = 0,
    year_scaled_n_births,
    value_scaled_n_births;

function move_index_n_births(curr_year) {
    var scale_x = d3.scale.linear()
        .domain([base, base + p - 1])
        .range([60 - year_scaled_n_births, 260 - year_scaled_n_births]);
    var pos_x_index = scale_x(curr_year);

    var scale_y = d3.scale.linear()
        .domain([base_line_births, max_born])
        .range([430 - value_scaled_n_births, 305 - value_scaled_n_births]);
    var pos_y_index = scale_y(new_borns[curr_year - base]);

    d3.selectAll("#index_n_births").attr("transform", "translate(" + pos_x_index + "," + pos_y_index + ")");

    current_year_births.transition().text(function () {
        return curr_year;
    });
    current_value_births.transition().text(function () {
        return number_reduction(axis_approx(new_borns[curr_year - base]));
    });
}

function draw_n_births_label() {
    svg_little_charts.append("text") // insert grouping label
        .text("NUMBER OF BIRTHS PER YEAR:")
        .attr("dx", 50)
        .attr("dy", 285)
        .attr("class", "info_text")
        .transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition

    svg_little_charts.append("text") // insert grouping label
        .text("YEAR:")
        .attr("dx", 70)
        .attr("dy", 470)
        .attr("class", "info_text")
        .style("font-size", 11 + "px")
        .transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition

    var current_year = svg_little_charts.append("text") // insert grouping label
        .attr("dx", 110)
        .attr("dy", 470)
        .attr("class", "info_text")
        .style("font-size", 11 + "px");
    current_year.transition().delay(500).duration(1000)
        .text(function () {
            return 1982;
        })
        .style("opacity", 1);

    svg_little_charts.append("text") // insert grouping label
        .text("VALUE:")
        .attr("dx", 170)
        .attr("dy", 470)
        .attr("class", "info_text")
        .style("font-size", 11 + "px")
        .transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition

    var current_value = svg_little_charts.append("text") // insert grouping label
        .attr("dx", 220)
        .attr("dy", 470)
        .attr("class", "info_text")
        .style("font-size", 11 + "px");
    current_value.transition().delay(500).duration(1000)
        .text(function () {
            return "600K";
        })
        .style("opacity", 1); // on enter label transition

    return [current_year, current_value];
}

function draw_n_births() {

    d3.csv(file_nameA, type, function (error, data) {

        new_borns = new Array(p),
            years_array = new Array(p);

        var new_borns_M = compute_new_born(data);

        d3.csv(file_nameB, type, function (error, data) {

            var new_borns_F = compute_new_born(data);

            for (i = 0; i < p; i++) {
                new_borns[i] = new_borns_M[i] + new_borns_F[i];
            }

            [min_born, max_born] = d3.extent(new_borns, function (d) {
                return d;
            });

            draw_births_x();
            draw_births_y();

            for (i = 0; i < p; i++) { // create an array with values from 1952 or from 1982
                years_array[i] = i + base;
            }

            var scale_x = d3.scale.linear()
                .domain([base, base + p - 1])
                .range([60, 260]);

            if (base_line_births != 0) {
                base_line_births = min_born;
            }

            var scale_y = d3.scale.linear()
                .domain([base_line_births, max_born])
                .range([430, 305]);

            var area = d3.svg.area()
                .x(function (d, i) {
                    return scale_x(years_array[i]);
                })
                .y0(435)
                .y1(435)
                .interpolate("cardinal");

            if (new_time_lenght > 0) {
                d3.selectAll(".births_chart").remove();
                svg_little_charts.append("path")
                    .datum(new_borns)
                    .attr("fill", "#e7e5cb")
                    .attr("class", "births_chart")
                    .attr("d", area);
                new_time_lenght--;
            }

            area.y1(function (d, i) {
                return scale_y(new_borns[i]);
            });
            d3.selectAll(".births_chart").transition().duration(1000).attr("d", area);

            var curr_year = col_name.substring(2, col_name.length);
            year_scaled_n_births = scale_x(curr_year);
            value_scaled_n_births = scale_y(new_borns[curr_year - base]);

            d3.selectAll("#index_n_births").remove();
            var c = svg_little_charts.append("circle") // draw magnifier icon
                .attr("id", "index_n_births")
                .attr("class", "index_charts");
            c.transition().delay(800).duration(100)
                .attr("cx", year_scaled_n_births)
                .attr("cy", value_scaled_n_births)
                .style("opacity", 1);
        });
    });
}

function type(d) {
    d.value = +d[col_name];
    return d;
}

function compute_new_born(data) { // compute the max of the whole file
    var save_col_name = col_name;
    var new_borns = new Array(p);
    var cols = d3.keys(data[0]);

    for (i = 1; i < cols.length - 1; i++) {
        col_name = cols[i];
        data.forEach(function (d) {
            d.col = +d[col_name];
        });
        new_borns[i - 1] = data[0].col;
    }
    col_name = save_col_name;
    return new_borns;
}

function draw_births_x() {
    var x_axis = [base, base + p / 2, base + p - 1];

    var births_x = svg_little_charts.selectAll(".births_x") // insert ages labels
        .data(x_axis);
    births_x.enter()
        .append("text")
        .attr("dx", function (d, i) {
            return 80 + 100 * i;
        })
        .attr("dy", 447)
        .attr("class", "births_x");

    births_x.transition() // transition on enter
        .duration(800)
        .text(function (d, i) {
            return x_axis[i];
        })
        .style("opacity", 1);
}

function draw_births_y() {
    var approx_max = axis_approx(max_born);

    if (base_line_births != 0) {
        base_line_births = min_born;
    }
    var approx_min = axis_approx(base_line_births);
    var y_axis = [number_reduction(approx_max), number_reduction((approx_max + approx_min) / 2), number_reduction(approx_min)];

    var births_y = svg_little_charts.selectAll(".births_y") // insert ages labels
        .data(y_axis);
    births_y.enter()
        .append("text")
        .attr("dx", 55)
        .attr("dy", function (d, i) {
            return 250 + 62 * (i + 1);
        })
        .attr("class", "births_y");

    births_y.transition() // transition on enter
        .duration(800)
        .text(function (d, i) {
            return y_axis[i];
        })
        .style("opacity", 1);
}