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

    compute_mean(curr_el, element.features, 0);

    if (first) { // transition to let italy appear
        curr_el.style("opacity", 0);

        curr_el.transition().delay(400)
            .duration(1000)
            .style("opacity", 0.7);
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
        d3.select(this).style("opacity", 1);
        tooltip_map.style("visibility", "visible");
        var place_name = extract_properties(d)[0].toUpperCase(); // show data on hover
        year_modification = false;
        if (mun_selected != 0) {
            return;
        }
        if (level == 2) { // if there's a mun with the same name of a province
            var url = "Data/Male/" + place_name + "_mun.csv";
            var http = new XMLHttpRequest();
            http.open('HEAD', url, false);
            http.send();
            if (http.status != 404) {
                place_name = place_name + "_mun";
            }
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
                d3.select(this).style("opacity", .7);
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