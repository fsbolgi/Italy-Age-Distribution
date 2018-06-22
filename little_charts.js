var svg_little_charts = d3.select(".places_history_svg"); // select correct svg

var col_name = "A_1982",
    file_nameA = "Data/Male/ITALIA.csv",
    file_nameB = "Data/Female/ITALIA.csv",
    new_borns = new Array(114);

function set_col_name(new_col_name) {
    col_name = new_col_name;
}

var line = d3.svg.line()
    .x(function(d) { return x(d[0]); })
    .y(function(d) { return y(d[1]); });

d3.csv("Data/Male/ITALIA.csv", type, function (error, data) {
    compute_new_born(data);

});


function type(d) {
    d.value = +d[col_name];
    return d;
}

function compute_new_born(data) { // compute the max of the whole file
    var save_col_name = col_name;

    var cols = d3.keys(data[0]);

    for (i = 1; i < cols.length - 1; i++) {
        col_name = cols[i];
        data.forEach(function (d) {
            d.col = +d[col_name];
        });

        new_borns[i] = data[0].col;

    }
    col_name = save_col_name;
}

