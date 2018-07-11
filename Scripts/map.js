var size_svg = 550, // width = height of the map
    svg_map = d3.select(".map_svg"),
    level = 0,
    el_CODE = 0,
    el_clickable = true,
    array_json = ["reg", "prov", "mun"],
    array_names = ["regions", "provinces", "municipalities"],
    scale = size_svg * 5.2,
    translate = [size_svg / 2, size_svg / 1.2],
    previous_el = 0,
    reg_el = 0,
    scale_el = 0,
    first = true,
    do_it = false,
    mun_selected = 0,
    mean_array,
    element;

var tooltip_map = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

var projection_map = d3.geo.albers() //projects spherical coordinate of italy to a plane
    .rotate([347, 0])
    .scale(scale)
    .translate(translate);
var path_map = d3.geo.path() //path takes the projection and formats it appropriately
    .projection(projection_map);

svg_map.append("rect")
    .attr("class", "background_map")
    .attr("width", size_svg)
    .attr("height", size_svg)
    .on("click", function () {
        zoom_out(level - 1);
    });

var g = svg_map.append("g");

next_level(); // draw another level of detail

function map_clicked(curr_el) {
    if (!el_clickable) { // check if a region is already selected
        return;
    }
    el_clickable = false; // avoid multiple selection

    zoom_in_histo(curr_el);     // update the histogram
    draw_tot_pop();
    draw_n_births();
    d3.selectAll(".rect_hover_histo_left").transition().duration(100).remove();
    d3.selectAll(".rect_hover_histo_right").transition().duration(100).remove();

    if (level == 1) { // for prov and mun disable past and future
        disable_time_section(true);
        new_time_lenght = 2;
    }

    if (level == 2) {
        if (extract_properties(curr_el)[0].toUpperCase() == "LAJATICO") {
            easter();
        }
        if (mun_selected != 0) {
            d3.select(mun_selected).style("opacity", 0.7);
            d3.selectAll("#places_text_3")
                .transition().duration(1200).style("opacity", 0).remove();
        }
        write_next_place(curr_el, level); // call function in header to insert arrow and region name
        mun_selected = this;
        d3.select(this).style("opacity", 1);
        el_clickable = true; // avoid multiple selection
        return;
    }
    write_next_place(curr_el, level); // call function in header to insert arrow and region name

    g.selectAll("." + array_names[level]).transition() // shrink and then remove the other regions
        .duration(800)
        .style("opacity", 0)
        .remove();


    if (level == 0) {
        reg_el = curr_el;
        scale_el = scale;
    }

    previous_el = curr_el;
    el_CODE = extract_properties(curr_el)[1];
    level = level + 1;

    next_level(); // restart drawing in the place clicked
}

function compute_mean(curr_place, obj_el, i) {
    if (i == 0) {
        mean_array = new Array(obj_el.length);
    }
    var name_place = extract_properties(obj_el[i])[0];

    var y = col_name.substring(2, col_name.length);

    if (level > 0 && (y <1982 || y>2017)) {
        var c = (y < 1982)? "orange": "blue";
        for (j = 0; j< curr_place[0].length; j++){
            (curr_place[0][j]).style.setProperty("fill", c);
        }
    } else {
        if (name_place.indexOf("/") != -1) {
            name_place = name_place.substring(0, name_place.indexOf("/")).trim();
        }
        if (level == 2) { // if there's a mun with the same name of a province
            name_place = name_place + "_mun";
        }
        var url = "Data/Male/" + name_place + ".csv"; // check if
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        if (http.status != 404) {

            d3.csv("Data/Male/" + name_place + ".csv", type, function (error, dataM) {

                var tot_popM = d3.sum(dataM, function (d) {
                    return d.value;
                });

                var mean_pop_M = compute_mean_age(dataM, tot_popM);

                d3.csv("Data/Female/" + name_place + ".csv", type, function (error, dataF) {


                    var tot_popF = d3.sum(dataF, function (d) {
                        return d.value;
                    });


                    var mean_pop_F = compute_mean_age(dataF, tot_popF);


                    mean_array[i] = (mean_pop_M + mean_pop_F) / 2;

                    if ((i + 1) == curr_place[0].length) {

                        var min, max;
                        [min, max] = d3.extent(mean_array, function (d) {
                            return d;
                        });

                        var map_color_scale = d3.scale.linear();
                        map_color_scale.domain([min, max]).interpolate(d3.interpolateHcl);

                        if (y < 1982) {
                            map_color_scale.range([d3.rgb("#ffcc00"), d3.rgb('#b30000')]);
                        } else if (y > 2017) {
                            map_color_scale.range([d3.rgb("#99ccff"), d3.rgb('#000099')]);
                        } else {
                            map_color_scale.range([d3.rgb("#99ff33"), d3.rgb('#006600')]);
                        }
                        for (j = 0; j < curr_place[0].length; j++) {
                            if (mean_array[j] == null) {
                                (curr_place[0][j]).style.setProperty("fill", "white");
                            } else {
                                (curr_place[0][j]).style.setProperty("fill", map_color_scale(mean_array[j]));

                            }
                        }
                    }
                    if ((i + 1) < curr_place[0].length) {
                        compute_mean(curr_place, obj_el, i + 1);
                    }
                });

            });
        } else {
            compute_mean(curr_place, obj_el, i + 1);
        }
    }
}

function zoom_out(level_clicked) {
    level_clicked = 0; ////////////////////////////////remove just for test

    if (level == 0 || level == level_clicked) {
        return;
    }
    for (l = level_clicked + 1; l <= 3; l++) {
        svgA_header.selectAll("#places_text_" + l)
            .transition().duration(1200).style("opacity", 0).remove();
        svgA_header.select("#places_text_" + l).each(function (d) {
            place_x = place_x - this.getComputedTextLength();
        });
    }

    place_x = place_x - 9;

    var place_name;
    svgA_header.selectAll(".places_text").filter(function (d, i) {
        if (i === level_clicked) {
            place_name = d3.select(this).text();
            place_name = place_name.substring(place_name.indexOf(">") + 1, place_name.length).trim();
        }
    });

    year_modification = false;
    file_nameA = "Data/Male/" + place_name + ".csv";
    file_nameB = "Data/Female/" + place_name + ".csv";
    draw_histo(file_nameA, svg_histoA, "left");
    draw_histo(file_nameB, svg_histoB, "right");

    var offset;
    if (level == 1) {
        offset = 4;
    } else {
        new_time_lenght = 2;
        offset = 2;
    }
    level = 0;

    draw_tot_pop();
    draw_n_births();
    disable_time_section(false);

    svg_map.selectAll("text").remove();

    if (level_clicked == 0) { // zoom to italy
        place_x = 80;

        var prov_x = path_map.bounds(previous_el)[0][0] - offset,
            prov_y = path_map.bounds(previous_el)[0][1] - offset,
            box = compute_bounding_box(previous_el),
            rect_diff = Math.abs(box[0] - box[1]) / 2;
        (box[0] > box[1]) ? prov_y = prov_y - rect_diff : prov_x = prov_x - rect_diff;

        g.transition()
            .duration(1200)
            .style("stroke-width", "1.5px")
            .attr("transform", "translate(" + [prov_x, prov_y] + ")scale(" + 1 / scale + ")")
            .each("end", next_level);
    } else { // zoom back to province ////////////////////////doesn't work!
        var prov_x = path_map.bounds(previous_el)[0][0] - offset,
            prov_y = path_map.bounds(previous_el)[0][1] - offset,
            box = compute_bounding_box(previous_el),
            rect_diff = Math.abs(box[0] - box[1]) / 2;
        (box[0] > box[1]) ? prov_y = prov_y - rect_diff : prov_x = prov_x - rect_diff;

        var reg_x = path_map.bounds(reg_el)[0][0] - offset,
            reg_y = path_map.bounds(reg_el)[0][1] - offset,
            box_reg = compute_bounding_box(reg_el),
            rect_diff_reg = Math.abs(box_reg[0] - box_reg[1]) / 2;
        (box_reg[0] > box_reg[1]) ? reg_y = reg_y - rect_diff_reg : reg_x = reg_x - rect_diff_reg;

        console.log(scale);
        console.log(scale_el);
        console.log(Math.min(size_svg * 0.92 / box[0], size_svg * 0.92 / box[1]));
        console.log(Math.min(size_svg * 0.92 / box_reg[0], size_svg * 0.92 / box_reg[1]));
        var s = Math.min(size_svg * 0.92 / box_reg[0], size_svg * 0.92 / box_reg[1]);
        g.transition()
            .duration(1200)
            .style("stroke-width", "1.5px")
            .attr("transform", "translate(" + [Math.abs(prov_x - reg_x) * 5.2, Math.abs(prov_y - reg_y) * 5.2] + ")scale(" + 1 / s + ")")
            .each("end", next_level);
    }


    /*svg_map.append("rect")
        .attr("x", prov_x)
        .attr("y", prov_y)
        .attr("width", box[0])
        .attr("height", box[1])
        .style("opacity", "0.5");*/

    g.selectAll(".provinces")
        .transition()
        .duration(1250)
        .style("stroke-width", "0px")
        .remove();
    g.selectAll(".municipalities")
        .transition()
        .duration(1250)
        .style("stroke-width", "0px")
        .remove();

    mun_selected = 0;
    el_CODE = 0;
    //el_CODE = extract_properties(reg_el)[1];
    //level = 1;
    //previous_el = reg_el;
    //do_it = true;
    //scale = 1 / scale * 5.2;
    g = svg_map.append("g");
}

/*key = encodeURI("zoom");
value = encodeURI("0");

var kvp = document.location.search.substr(1).split('&');

var i = kvp.length;
var x;
while (i--) {
    x = kvp[i].split('=');

    if (x[0] == key) {
        x[1] = value;
        kvp[i] = x.join('=');
        break;
    }
}

if (i < 0) {
    kvp[kvp.length] = [key, value].join('=');
}

//this will reload the page, it's likely better to store this until finished
//document.location.search = kvp.join('&');*/
