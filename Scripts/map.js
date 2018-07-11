var size_svg = 550, // width = height of the map
    svg_map = d3.select(".map_svg"),
    level = 0,
    el_CODE = 0,
    el_clickable = true,
    array_json = ["reg", "prov", "mun"],
    array_names = ["regions", "provinces", "municipalities"],
    scale = size_svg * 5.2,
    translate = [size_svg / 2, size_svg / 1.25],
    previous_el = 0,
    reg_el = 0,
    scale_el = 0,
    first = true,
    do_it = false,
    mun_selected = 0,
    mean_array,
    element,
    place_name = 0;

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

retrieve_mean_files();

create_legend();

var g = svg_map.append("g");

next_level(); // draw another level of detail

function map_clicked(curr_el) {
    if (!el_clickable || is_place_missing(extract_properties(curr_el)[0])) { // check if a region is already selected
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
            d3.select(mun_selected).style("opacity", 1);
            d3.selectAll("#places_text_3")
                .transition().duration(1200).style("opacity", 0).remove();
        }
        write_next_place(curr_el, level); // call function in header to insert arrow and region name
        mun_selected = this;
        d3.select(this).style("opacity", 0.5);
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

function compute_mean(curr_place, obj_el) {

    mean_array = new Array(obj_el.length);
    var y = col_name.substring(2, col_name.length);
    base = (level > 1) ? 1982 : 1952;

    var mfF = (level == 2) ? mean_file_F_mun : mean_file_F;
    var mfM = (level == 2) ? mean_file_M_mun : mean_file_M;

    for (i = 0; i < obj_el.length; i++) {
        place_name = extract_properties(obj_el[i])[0];
        if (place_name.indexOf("/") != -1) {
            place_name = place_name.substring(0, place_name.indexOf("/")).trim();
        }
        if (level == 1) {
            if (y >= 1982 && y <= 2017) {
                mean_array[i] = (Number(mfF[y - 30 - base][place_name]) + Number(mfM[y - 30 - base][place_name])) / 2;
            } else {
                mean_array[i] = 0;
            }
        } else {
            mean_array[i] = (Number(mfF[y - base][place_name]) + Number(mfM[y - base][place_name])) / 2;
        }
    }

    if (level > 0 && (y < 1982 || y > 2017)) {
        for (j = 0; j < curr_place[0].length; j++) {
            if (y < 1982) {
                (curr_place[0][j]).style.setProperty("fill", "#f3b748");
            } else if (y > 2017) {
                (curr_place[0][j]).style.setProperty("fill", "#388393");
            }
        }
        update_legend(0, 0, y);
    } else {
        var min, max;
        [min, max] = d3.extent(mean_array, function (d) {
            return d;
        });

        update_legend(min, max, y);

        var map_color_scale = d3.scale.linear();
        map_color_scale.domain([min, max]).interpolate(d3.interpolateHcl);

        if (y < 1982) {
            map_color_scale.range([d3.rgb("#ffdd65"), d3.rgb('#c16000')]);
        } else if (y > 2017) {
            map_color_scale.range([d3.rgb("#96e5ea"), d3.rgb('#1f4d5b')]);
        } else {
            map_color_scale.range([d3.rgb("#7ee3ab"), d3.rgb('#0e412a')]);
        }
        for (j = 0; j < curr_place[0].length; j++) {
            if (mean_array[j] > 0) {
                (curr_place[0][j]).style.setProperty("fill", map_color_scale(mean_array[j]));
            } else {
                (curr_place[0][j]).style.setProperty("fill", "#cccccc");
            }
        }
    }
}

function zoom_out(level_clicked) {
    level_clicked = 0;

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

    place_x = 65;

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
    g = svg_map.append("g");
}