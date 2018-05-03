var width = 600; // width and height of the map
var svg_map = d3.select(".map_svg"); // select correct svg

d3.json("Maps/regTopo.json", create_map); // read topojson file and calls a function

function create_map (error, json_reg) {
    if (error) return console.error(error); // if file not found print error on console
    //console.log(reg);
    //convert from topo to geo for display
    var regions = topojson.feature(json_reg, json_reg.objects.regions);

    var projection_ita = d3.geo.albers() //projects spherical coordinate to a plane
        .center([0, 41])
        .rotate([347, 0])
        .parallels([35, 45])
        .scale(width*5.3)
        .translate([width / 2, width / 1.71]);

    var path = d3.geo.path() //path takes the projection and formats it appropriately
        .projection(projection_ita);

    // insert the map in the svg
    svg_map.selectAll(".regions")
        .data(regions.features)
        // what to do on opening
        .enter()
        .append("path")
        .attr("class", function(d) {return "regions " + d.id; })
        .attr("d", path)
        // what to do when a hover over a region
        .on("mouseover", function(curr_region){
            svg_map.append("text")
                .text(curr_region.properties.NOME_REG)
                .attr("transform", "translate(" + path.centroid(curr_region)[0]+", " + (path.bounds(curr_region)[0][1]-5)+ ")")
                .attr("dy", ".35em")
                .attr("class", "regions_label " + curr_region.properties.NOME_REG);
        })
        // what to do when hovering out of a region
        .on("mouseout", function(){ svg_map.selectAll("text").remove(); })
        // what to do when clicking on a region
        .on("click", region_clicked);

    function region_clicked(curr_region) {
        var bounding_box = path.bounds(curr_region);
        var box_width = bounding_box[1][0] - bounding_box[0][0],
            box_height = bounding_box[1][1] - bounding_box[0][1],
            box_center_x = (bounding_box[0][0] + bounding_box[1][0]) / 2,
            box_center_y = (bounding_box[0][1] + bounding_box[1][1]) / 2;
        var scale = .9 / Math.max(box_width / width, box_height / width),
            translate = [width / 2 - scale * box_center_x, width / 2 - scale * box_center_y];
        d3.select(this).attr("class", "current_region");
        svg_map.selectAll(".regions").transition()
            .duration(700)
            .attr("transform", "translate(" + [width / 2, width / 1.71] + ")scale(0)")
            .remove();

        d3.select(this).transition()
            .duration(700)//.ease(d)
            .style("stroke-width", 1.5 / scale + "px")
            .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
        svg_map.selectAll("text").remove();
        d3.selectAll(".current_region")
            .on("mouseover", function (d) {
            });
        draw_arrow(curr_region);
    }
}

