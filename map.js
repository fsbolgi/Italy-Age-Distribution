var size_svg = 550, // width = height of the map
    svg_map = d3.select(".map_svg"), // select correct svg
    level = 0,
    el_CODE = 0,
    el_clickable = true,
    array_json = ["reg", "prov", "mun"],
    array_names = ["regions", "provinces", "municipalities"],
    scale = size_svg * 5.2,
    translate = [size_svg / 2, size_svg / 1.2],
    previous_el = 0,
    map_label_x = 0,
    map_label_y = 0;

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
    .on("click", zoom_out);

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
        .enter() // what to do on opening
        .append("path")
        .attr("class", function (d) {
            return array_names[level] + " " + d.id;
        })
        .attr("d", path_map);

    if (level != 0) {
        d3.select(this).remove(); // remove selected region
        g.selectAll("text").remove(); // remove selected region name
        scale = scale_map();
        translate = translate_map();
        curr_el.transition() // zooms on the region selected
            .duration(1000)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        el_clickable = true;
    }
    curr_el.on("mouseover", map_hovered)
        .on("mouseout", function () { // remove the name when hovering out of a region
            g.selectAll("text").remove();
        })
        .on("click", map_clicked); // call function when click on a region
}

function map_hovered(curr_el) {// when hovering over a region show the name
    if (level == 0) {
        map_label_x = path_map.centroid(curr_el)[0];
        map_label_y = path_map.bounds(curr_el)[0][1] - 4;
    } else {
        map_label_x = map_label_position(curr_el)[0];
        map_label_y = map_label_position(curr_el)[1];
    }
    g.append("text")
        .text((extract_properties(curr_el)[0]).toUpperCase())
        .attr("dx", map_label_x)
        .attr("dy", map_label_y)
        .attr("class", array_names[level] + "_label");
}

function map_clicked(curr_el) {
    if (!el_clickable) { // check if a region is already selected
        return;
    }
    el_clickable = false; // avoid multiple selection
    draw_arrow(curr_el, level); // call function in places_history.js to insert arrow and region name
    if (level == 2) {
        d3.select(this).style("opacity", 1);
        return;
    }
    g.selectAll("." + array_names[level]).transition() // shrink and then remove the other regions
        .duration(1000)
        .attr("transform", "translate(250,250)scale(0)")
        .remove();

    if (level == 1) {
        var box_reg = path_map.bounds(curr_el);
        var box_reg_x = box_reg[0][0];
        var box_reg_y = box_reg[0][1];
        console.log(scale);
        console.log("box " + compute_bounding_box(curr_el));
        console.log((size_svg *scale - size_svg) - compute_bounding_box(previous_el)[2]);
        scale = size_svg * scale_map() * 5.2;
        translate = [box_reg_x, box_reg_y];
        console.log(box_reg_x*scale);
        console.log((scale*size_svg-size_svg)/2);


        projection_map = d3.geo.albers() //projects spherical coordinate of italy to a plane
            .rotate([347, 0])
            .scale(scale)
            .translate(translate);
        path_map = d3.geo.path() //path takes the projection and formats it appropriately
            .projection(projection_map);
    }
    previous_el = curr_el;
    el_CODE = extract_properties(curr_el)[1];
    level = level + 1;

    next_level();
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

function map_label_position(curr_el) {
    var prov_x = path_map.centroid(curr_el)[0] - path_map.bounds(previous_el)[0][0],
        prov_y = path_map.bounds(curr_el)[0][1] - path_map.bounds(previous_el)[0][1],
        box = compute_bounding_box(previous_el),
        rect_diff = Math.abs(box[0] - box[1]) / 2;

    (box[0] > box[1])? prov_y = prov_y + rect_diff : prov_x = prov_x + rect_diff;

    var x = prov_x * scale + 0.08 * size_svg / 2,
        y = prov_y * scale + 0.08 * size_svg / 2 - 4;
    return [x, y];
}

function zoom_out() {
    remove_level();
    if (level == 0) {
        return;
    }

    var prov_x = path_map.bounds(previous_el)[0][0] - 4,
        prov_y = path_map.bounds(previous_el)[0][1] - 4,
        box = compute_bounding_box(previous_el),
        rect_diff = Math.abs(box[0] - box[1]) / 2;
    (box[0] > box[1])? prov_y = prov_y - rect_diff : prov_x = prov_x - rect_diff;

    g.transition()
        .duration(1000)
        .style("stroke-width", "1.5px")
        .attr("transform", "translate(" + [prov_x, prov_y] + ")scale(" + 1 / scale + ")")
        .each("end", next_level);

    g.selectAll(".provinces")
        .transition()
        .duration(1050)
        .style("stroke-width", "0px")
        .remove();

    level = 0;
    el_CODE = 0;
    g = svg_map.append("g");
}

