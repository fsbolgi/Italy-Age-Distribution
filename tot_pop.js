var svg_little_charts = d3.select(".little_charts_svg"), // select correct svg
    grid = true,
    col_name = "A_1982",
    file_nameA = "Data/Male/ITALIA.csv",
    file_nameB = "Data/Female/ITALIA.csv",
    new_time_lenght = 2,
    base, p,
    min_pop, max_pop,
    tot_pop,
    path_tot,
    year_scaled_tot_pop,
    value_scaled_tot_pop;

function move_index_tot_pop(curr_year) {
    var scale_x = d3.scale.linear()
        .domain([base, base + p - 1])
        .range([60-year_scaled_tot_pop, 260-year_scaled_tot_pop]); //transform [-50, 140]
    var pos_x_index = scale_x(curr_year);

    var scale_y = d3.scale.linear()
        .domain([min_pop, max_pop])
        .range([175-value_scaled_tot_pop, 60-value_scaled_tot_pop]);
    var pos_y_index = scale_y(tot_pop[curr_year - base]);

    d3.selectAll("#index_tot_pop").attr("transform", "translate(" + pos_x_index + "," + pos_y_index + ")");
}

function draw_tot_pop_label() {
    var tot_pop_label = svg_little_charts.append("text") // insert grouping label
        .text("TOTAL POLULATION PER YEAR:")
        .attr("dx", 30)
        .attr("dy", 30)
        .attr("class", "info_text");

    tot_pop_label.transition().delay(500).duration(1000).style("opacity", 1); // on enter label transition
}

function draw_tot_pop() {

    d3.csv(file_nameA, type, function (error, data) {

        p = (level > 1) ? 36 : 114;
        base = (level > 1) ? 1982 : 1952;
        tot_pop = new Array(p),
            years_array = new Array(p);

        var tot_pop_M = compute_tot_pop(data);

        d3.csv(file_nameB, type, function (error, data) {

            var tot_pop_F = compute_tot_pop(data);

            for (i = 0; i < p; i++) {
                tot_pop[i] = tot_pop_M[i] + tot_pop_F[i];
            }

            [min_pop, max_pop] = d3.extent(tot_pop, function (d) {
                return d;
            });

            draw_pop_x();
            draw_pop_y();

            for (i = 0; i < p; i++) { // create an array with values from 1952 or from 1982
                years_array[i] = i + base;
            }

            var scale_x = d3.scale.linear()
                .domain([base, base + p - 1])
                .range([60, 260]);

            var scale_y = d3.scale.linear()
                .domain([min_pop, max_pop])
                .range([175, 60]);

            var area = d3.svg.area()
                .x(function (d, i) {
                    return scale_x(years_array[i]);
                })
                .y0(180)
                .y1(180)
                .interpolate("cardinal");

            if (new_time_lenght > 0) {
                d3.selectAll(".tot_pop_chart").remove();
                path_tot = svg_little_charts.append("path")
                    .datum(tot_pop)
                    .attr("fill", "#e7e5cb")
                    .attr("class", "tot_pop_chart")
                    .attr("d", area);
                new_time_lenght--;
            }

            area.y1(function (d, i) {
                return scale_y(tot_pop[i]);
            });
            d3.selectAll(".tot_pop_chart").transition().duration(1000).attr("d", area);

            var curr_year = col_name.substring(2, col_name.length);
            year_scaled_tot_pop = scale_x(curr_year);
            value_scaled_tot_pop = scale_y(tot_pop[curr_year - base]);

            d3.selectAll("#index_tot_pop").remove();
            var c = svg_little_charts.append("circle") // draw magnifier icon
                .attr("id", "index_tot_pop")
                .attr("class", "index_charts");
            c.transition().attr("cx", year_scaled_tot_pop)
                .attr("cy", value_scaled_tot_pop)
                .transition().delay(800).duration(100).style("opacity", 1); // transitions on enter
        });
    });
}

function type(d) {
    d.value = +d[col_name];
    return d;
}

function compute_tot_pop(data) { // compute the max of the whole file
    var save_col_name = col_name;
    var tot_pop = new Array(p);
    var cols = d3.keys(data[0]);

    for (i = 1; i < cols.length - 1; i++) {
        col_name = cols[i];
        data.forEach(function (d) {
            d.col = +d[col_name];
        });
        tot_pop[i - 1] = d3.sum(data, function (d) {
            return d.col;
        });
    }
    col_name = save_col_name;
    return tot_pop;
}

function draw_pop_x() {
    var x_axis = [base, base + p / 2, base + p - 1];

    var pop_x = svg_little_charts.selectAll(".pop_x") // insert ages labels
        .data(x_axis);
    pop_x.enter()
        .append("text")
        .attr("dx", function (d, i) {
            return 80 + 100 * i;
        })
        .attr("dy", 192)
        .attr("class", "pop_x");

    pop_x.transition() // transition on enter
        .duration(800)
        .text(function (d, i) {
            return x_axis[i];
        })
        .style("opacity", 1);
}

function draw_pop_y() {
    var y_axis = [max_pop, (max_pop - min_pop) / 2, min_pop];

    var pop_y = svg_little_charts.selectAll(".pop_y") // insert ages labels
        .data(y_axis);
    pop_y.enter()
        .append("text")
        .attr("dx", 55)
        .attr("dy", function (d, i) {
            return 55 + 60 * i;
        })
        .attr("class", "pop_y");

    pop_y.transition() // transition on enter
        .duration(800)
        .text(function (d, i) {
            return y_axis[i];
        })
        .style("opacity", 1);
}