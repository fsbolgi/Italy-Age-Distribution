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
    mun_selected = 0;

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

function next_level() {
    var file_json = "Maps/" + el_CODE + "_" + array_json[level] + "Topo.json"; // name of the file json

    d3.json(file_json, create_map); // read topojson file and calls a function
}

function create_map(error, json_el) {
    if (error) return console.error(error); // if file not found print error on console
    var element = topojson.feature(json_el, extract_features(json_el)); //convert from topo to geo for display

    var curr_el = g.selectAll(array_names[level]) // insert the map with the next level of detail in the svg
        .data(element.features) // loop for each region
        .enter()
        .append("path")
        .attr("class", function (d) {
            return array_names[level];
        })
        .attr("d", path_map);

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
        if (mun_selected != 0){
            d3.select(mun_selected).style("opacity", 0.7);
            d3.select("#places_text_3")
                .transition().duration(1200).style("opacity", 0).remove();
            d3.select("#places_text_3").each(function (d) {
                place_x = place_x - this.getComputedTextLength()-9;
            });
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


function extract_features(json_el) {
    switch (level) {
        case 0:
            return json_el.objects.regions;
        case 1:
            return json_el.objects.provinces;
        case 2:
            return json_el.objects.municipalities;
    }
}

function extract_properties(curr_el) {
    var nome, cod;
    switch (level) {
        case 0:
            nome = curr_el.properties.NOME_REG;
            cod = curr_el.properties.COD_REG;
            break;
        case 1:
            nome = curr_el.properties.NOME_PRO;
            cod = curr_el.properties.COD_PRO;
            break;
        case 2:
            nome = curr_el.properties.NOME_COM;
            cod = curr_el.properties.COD_COM;
            break;
    }
    return [nome, cod];
}

function compute_bounding_box(element) {
    var bounding_box = path_map.bounds(element);
    var box_width = bounding_box[1][0] - bounding_box[0][0],
        box_height = bounding_box[1][1] - bounding_box[0][1],
        box_center_x = (bounding_box[0][0] + bounding_box[1][0]) / 2,
        box_center_y = (bounding_box[0][1] + bounding_box[1][1]) / 2;
    return [box_width, box_height, box_center_x, box_center_y];
}

function scale_map() {
    var box = compute_bounding_box(previous_el);
    return Math.min(size_svg * 0.92 / box[0], size_svg * 0.92 / box[1]);
}

function translate_map() {
    var box = compute_bounding_box(previous_el);
    return [size_svg / 2 - scale * box[2], size_svg / 2 - scale * box[3]];
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

    place_x = place_x - 10;

    var place_name;
    svgA_header.selectAll(".places_text").filter(function (d, i) {
        if (i === level_clicked) {
            place_name = d3.select(this).text();
            place_name = place_name.substring(place_name.indexOf(">")+1, place_name.length).trim();
        }
    });

    year_modification = false;
    file_nameA = "Data/Male/" + place_name + ".csv";
    file_nameB = "Data/Female/" + place_name + ".csv";
    draw_histo(file_nameA, svg_histoA, "left");
    draw_histo(file_nameB, svg_histoB, "right");

    draw_n_births();
    draw_tot_pop();
    disable_time_section(false); ////////////change!

    svg_map.selectAll("text").remove();

    var offset;
    if (level == 1) {
        offset = 4;
    } else {
        new_time_lenght = 2;
        offset = 2;
    }

    if (level_clicked == 0) { // zoom to italy
        var prov_x = path_map.bounds(previous_el)[0][0] - offset,
            prov_y = path_map.bounds(previous_el)[0][1] - offset,
            box = compute_bounding_box(previous_el),
            rect_diff = Math.abs(box[0] - box[1]) / 2;
        (box[0] > box[1]) ? prov_y = prov_y - rect_diff : prov_x = prov_x - rect_diff;

        g.transition()
            .duration(1200)
            .style("stroke-width", "1.5px")
            .attr("transform", "translate(" + [prov_x, prov_y] + ")scale(" + 1 / scale  + ")")
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
            .attr("transform", "translate(" + [Math.abs(prov_x-reg_x)*5.2, Math.abs(prov_y-reg_y)*5.2] + ")scale(" + 1 / s + ")")
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
    level = 0;
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