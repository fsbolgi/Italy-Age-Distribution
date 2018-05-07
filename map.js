var size_svg = 600, // width = height of the map
    svg_map = d3.select(".map_svg"), // select correct svg
    reg_clickable = true;

var projection_map = d3.geo.albers() //projects spherical coordinate of italy to a plane
    .center([0, 41])
    .rotate([347, 0])
    .parallels([35, 45])
    .scale(size_svg * 5.2)
    .translate([size_svg / 2, size_svg / 1.71]);

var path_map = d3.geo.path() //path takes the projection and formats it appropriately
    .projection(projection_map);

d3.json("Maps/regTopo.json", create_map); // read topojson file and calls a function

function create_map(error, json_reg) {
    if (error) return console.error(error); // if file not found print error on console

    var regions = topojson.feature(json_reg, json_reg.objects.regions); //convert from topo to geo for display

    var curr_reg = svg_map.selectAll(".regions") // insert the map with the regions in the svg
        .data(regions.features) // loop for each region
        .enter() // what to do on opening
        .append("path")
        .attr("class", function (d) {
            return "regions " + d.id;
        })
        .attr("d", path_map);

    curr_reg.on("mouseover", function (curr_reg) { // when hovering over a region show the name
            svg_map.append("text")
                .text(curr_reg.properties.NOME_REG)
                .attr("dx", path_map.centroid(curr_reg)[0])
                .attr("dy", path_map.bounds(curr_reg)[0][1] - 4)
                .attr("class", "regions_label " + curr_reg.properties.COD_REG);
        })
        .on("mouseout", function () { // remove the name when hovering out of a region
            svg_map.selectAll("text").remove();
        })
        .on("click", reg_clicked); // call function when click on a region

    function reg_clicked(curr_reg) {
        if (!reg_clickable) { // check if a region is already selected
            return;
        }
        reg_clickable = false; // avoid multiple selection

        d3.select(this).remove(); // remove selected region
        svg_map.selectAll("text").remove(); // remove selected region name

        svg_map.selectAll(".regions").transition() // shrink and then remove the other regions
            .duration(700)
            .attr("transform", "translate(" + [size_svg / 2, size_svg / 1.71] + ")scale(0)")
            .remove();

        draw_arrow(curr_reg); // call function in places_history.js to insert arrow and region name
        draw_prov(); // call function to draw the province level

        function draw_prov() {
            d3.json("Maps/Regions/" + curr_reg.properties.COD_REG + "_provTopo.json", function (error, json_prov) {
                if (error) return console.error(error); // if file not found print error on console

                var province = topojson.feature(json_prov, json_prov.objects.provinces);

                var curr_prov = svg_map.selectAll(".provinces") // draws the provinces in the region selected
                    .data(province.features)
                    .enter() // what to do on opening
                    .append("path")
                    .attr("class", function (d) {
                        return "provinces " + d.id;
                    })
                    .attr("d", path_map);

                var bounding_box = path_map.bounds(curr_reg);
                var box_width = bounding_box[1][0] - bounding_box[0][0],
                    box_height = bounding_box[1][1] - bounding_box[0][1],
                    box_center_x = (bounding_box[0][0] + bounding_box[1][0]) / 2,
                    box_center_y = (bounding_box[0][1] + bounding_box[1][1]) / 2;
                var scale = Math.min(size_svg * 0.92 / box_width, size_svg * 0.92 / box_height),
                    translate = [size_svg / 2 - scale * box_center_x, size_svg / 2 - scale * box_center_y];

                curr_prov.transition() // zooms on the region selected
                    .duration(700)//.ease(d)
                    .style("stroke-width", 1.5 / scale + "px")
                    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

                curr_prov.on("mouseover", function (curr_prov) { // what to do when a hover over a province

                    var prov_x = path_map.centroid(curr_prov)[0] - path_map.bounds(curr_reg)[0][0],
                        prov_y = path_map.bounds(curr_prov)[0][1] - path_map.bounds(curr_reg)[0][1],
                        rect_diff = Math.abs(box_width - box_height) / 2;

                    if (box_width > box_height) {
                        prov_y = prov_y + rect_diff;
                    } else {
                        prov_x = prov_x + rect_diff;
                    }

                    var w = path_map.bounds(curr_prov);

                    svg_map.append("text")
                        .text(curr_prov.properties.NOME_PRO)
                        .attr("dx", prov_x * scale + 0.08 * size_svg / 2)
                        .attr("dy", prov_y * scale + 0.08 * size_svg / 2 - 4)
                        .attr("class", "provinces_label " + curr_prov.properties.NOME_PRO);
                })
                // what to do when hovering out of a region
                    .on("mouseout", function () {
                        svg_map.selectAll("text").remove();
                    });
                // what to do when clicking on a region
                /*.on("click", region_clicked)*/

            });
        }
    }
}

