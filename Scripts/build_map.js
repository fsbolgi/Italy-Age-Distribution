var curr_epoc = "PRESENT",
    mean_file_F = 0,
    mean_file_M = 0,
    mean_file_F_mun = 0,
    mean_file_M_mun = 0;

function retrieve_mean_files() {
    d3.csv("Data/transposeF.csv", function (error, dataF) {
        mean_file_F = dataF;
    });
    d3.csv("Data/transposeM.csv", function (error, dataM) {
        mean_file_M = dataM;
    });
    d3.csv("Data/transposeF_mun.csv", function (error, dataF_mun) {
        mean_file_F_mun = dataF_mun;
    });
    d3.csv("Data/transposeM_mun.csv", function (error, dataM_mun) {
        mean_file_M_mun = dataM_mun;
    });
}

function next_level() {
    var file_json = "Maps/" + el_CODE + "_" + array_json[level] + "Topo.json"; // name of the file json

    d3.json(file_json, create_map); // read topojson file and calls a function
}

function create_map(error, json_el) {
    if (error) return console.error(error); // if file not found print error on console
    element = topojson.feature(json_el, extract_features(json_el)); //convert from topo to geo for display

    curr_el = g.selectAll(array_names[level]) // insert the map with the next level of detail in the svg
        .data(element.features) // loop for each region
        .enter()
        .append("path");
    curr_el.attr("class", function (d) {
        return array_names[level];
    }).attr("d", path_map);

    compute_mean(curr_el, element.features);

    if (first) { // transition to let italy appear
        curr_el.style("opacity", 0);

        curr_el.transition().delay(400)
            .duration(1000)
            .style("opacity", 1);
        first = false;
    }

    if (level > 0 || do_it) { //zoom and center the element selected
        if (level > 1) { // perform a multiple zoom if it's a province
            curr_el.style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        }
        scale = scale_map();
        translate = translate_map();
        curr_el.transition()
            .duration(1200)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
    }
    el_clickable = true;

    curr_el.on("mouseover", function (d) {
        d3.select(this).style("opacity", 0.5);
        tooltip_map.style("visibility", "visible");
        var place_name = extract_properties(d)[0].toUpperCase(); // show data on hover
        year_modification = false;
        if (is_place_missing(place_name)) {
            d3.select(this).style("cursor", "auto");
            return;
        }
        if (mun_selected != 0) {
            return;
        }
        if (level == 2) { // if there's a mun with the same name of a province
            place_name = place_name + "_mun";
        }
        var file_nameA = "Data/Male/" + place_name + ".csv";
        var file_nameB = "Data/Female/" + place_name + ".csv";
        draw_hover_histo(file_nameA, svg_histoA, "left");
        draw_hover_histo(file_nameB, svg_histoB, "right");
    })
        .on("mouseout", function () {
            d3.selectAll(".rect_hover_histo_left").transition().duration(100).remove();
            d3.selectAll(".rect_hover_histo_right").transition().duration(100).remove();
            if (mun_selected != this) {
                d3.select(this).style("opacity", 1);
            }
            tooltip_map.style("visibility", "hidden");
        })
        .on("mousemove", function (d, i) {
            tooltip_map.style("top", (event.pageY - 15) + "px")
                .style("left", (event.pageX + 17) + "px")
                .style("font-size", 14 + "px")
                .html((extract_properties(d)[0]).toUpperCase());
        })
        .on("click", map_clicked); // call function when click on a region
}

function create_legend() {

    svg_map.append("text") // insert grouping label
        .text("AVERAGE AGE")
        .attr("dx", 45)
        .attr("dy", 550)
        .attr("class", "info_text")
        .transition().delay(1000).duration(1000).style("opacity", 1); // on enter label transition

    svg_map.append("svg:image")
        .attr("xlink:href", "Images/PRESENT.png")
        .attr("class", "image")
        .attr("x", 50)
        .attr("y", 560)
        .attr("width", 130)
        .attr("height", 15)
        .transition().delay(1000).duration(100).style("opacity", 1);

    var min_age = svg_map.append("text") // insert grouping label
        .attr("dx", 45)
        .attr("dy", 590)
        .attr("class", "info_text")
        .attr("id", "legend_min")
        .style("font-size", 11 + "px");
    min_age.transition().delay(500).duration(1000)
        .text(function () {
            return 30;
        })
        .style("opacity", 1);

    var avg_age = svg_map.append("text") // insert grouping label
        .attr("dx", 105)
        .attr("dy", 590)
        .attr("class", "info_text")
        .attr("id", "legend_avg")
        .style("font-size", 11 + "px");
    avg_age.transition().delay(500).duration(1000)
        .text(function () {
            return 34.5;
        })
        .style("opacity", 1);

    var max_age = svg_map.append("text") // insert grouping label
        .attr("dx", 170)
        .attr("dy", 590)
        .attr("class", "info_text")
        .attr("id", "legend_max")
        .style("font-size", 11 + "px");
    max_age.transition().delay(500).duration(1000)
        .text(function () {
            return 39;
        })
        .style("opacity", 1);
}

function update_legend(min, max, year) {
    var avg = (Number(min) + Number(max)) / 2;
    svg_map.select("#legend_min").text(min);
    svg_map.select("#legend_avg").text(avg);
    svg_map.select("#legend_max").text(max);

    var epoc;
    if (year < 1982) {
        epoc = "PAST";
    } else if (year > 2017) {
        epoc = "FUTURE";
    } else {
        epoc = "PRESENT";
    }

    if (epoc != curr_epoc) {
        curr_epoc = epoc;
        svg_map.selectAll(".image").remove();
        svg_map.append("svg:image")
            .attr("xlink:href", "Images/"+epoc+".png")
            .attr("class", "image")
            .attr("x", 50)
            .attr("y", 560)
            .attr("width", 130)
            .attr("height", 15)
            .style("opacity", 1);
    }
}