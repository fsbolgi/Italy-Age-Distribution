var width = 600; // width and height of the map
var svg_map = d3.select(".map_svg"); // select correct svg
var reg_clickable = true;

d3.json("Maps/regTopo.json", create_map); // read topojson file and calls a function

function create_map(error, json_reg) {
    if (error) return console.error(error); // if file not found print error on console
    //console.log(reg);
    //convert from topo to geo for display
    var regions = topojson.feature(json_reg, json_reg.objects.regions);

    var projection_ita = d3.geo.albers() //projects spherical coordinate to a plane
        .center([0, 41])
        .rotate([347, 0])
        .parallels([35, 45])
        .scale(width * 5.2)
        .translate([width / 2, width / 1.71]);

    var path_ita = d3.geo.path() //path takes the projection and formats it appropriately
        .projection(projection_ita);

    // insert the map in the svg
    svg_map.selectAll(".regions")
        .data(regions.features)
        // what to do on opening
        .enter()
        .append("path")
        .attr("class", function (d) {
            return "regions " + d.id;
        })
        .attr("d", path_ita)
        // what to do when a hover over a region
        .on("mouseover", function (curr_region) {
            svg_map.append("text")
                .text(curr_region.properties.NOME_REG)
                .attr("dx", path_ita.centroid(curr_region)[0])
                .attr("dy", path_ita.bounds(curr_region)[0][1] - 4)
                .attr("class", "regions_label " + curr_region.properties.NOME_REG);
        })
        // what to do when hovering out of a region
        .on("mouseout", function () {
            svg_map.selectAll("text").remove();
        })
        // what to do when clicking on a region
        .on("click", region_clicked);

    function region_clicked(curr_region) {
        if (!reg_clickable) {
            return;
        }
        reg_clickable = false;

        d3.select(this).remove();
        svg_map.selectAll(".regions").transition()
            .duration(700)
            .attr("transform", "translate(" + [width / 2, width / 1.71] + ")scale(0)")
            .remove();
        svg_map.selectAll("text").remove();

        draw_arrow(curr_region);

        d3.json("Maps/Regions/" + curr_region.properties.COD_REG + "_provTopo.json", function (error, json_prov) {
            if (error) return console.error(error); // if file not found print error on console
            var province = topojson.feature(json_prov, json_prov.objects.provinces);

            var projection_reg = d3.geo.albers() //projects spherical coordinate to a plane
                .center([0, 41])
                .rotate([347, 0])
                .parallels([35, 45])
                .scale(width * 5.2)
                .translate([width / 2, width / 1.71]);
            var path_reg = d3.geo.path() //path takes the projection and formats it appropriately
                .projection(projection_reg);

            var curr_prov = svg_map.selectAll(".provinces") // draws the provinces in the region selected
                .data(province.features)
                .enter() // what to do on opening
                .append("path")
                .attr("class", function (d) {
                    return "provinces " + d.id;
                })
                .attr("d", path_reg);

            var bounding_box = path_ita.bounds(curr_region);
            var box_width = bounding_box[1][0] - bounding_box[0][0],
                box_height = bounding_box[1][1] - bounding_box[0][1],
                box_center_x = (bounding_box[0][0] + bounding_box[1][0]) / 2,
                box_center_y = (bounding_box[0][1] + bounding_box[1][1]) / 2;
            var scale = Math.min(width * 0.92 / box_width, width * 0.92 / box_height),
                translate = [width / 2 - scale * box_center_x, width / 2 - scale * box_center_y];

            curr_prov.transition() // zooms on the region selected
                .duration(700)//.ease(d)
                .style("stroke-width", 1.5 / scale + "px")
                .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

            curr_prov.on("mouseover", function (curr_prov) { // what to do when a hover over a province

                var prov_x = path_reg.centroid(curr_prov)[0] - path_ita.bounds(curr_region)[0][0],
                    prov_y = path_reg.bounds(curr_prov)[0][1] - path_ita.bounds(curr_region)[0][1],
                    rect_diff = Math.abs(box_width - box_height) / 2;

                if (box_width > box_height) {
                    prov_y = prov_y + rect_diff;
                } else {
                    prov_x = prov_x + rect_diff;
                }

                var w = path_reg.bounds(curr_prov);

                svg_map.append("text")
                    .text(curr_prov.properties.NOME_PRO)
                    .attr("dx", prov_x * scale + 0.08 * width / 2)
                    .attr("dy", prov_y * scale + 0.08 * width / 2 - 4)
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

