function screen_width() {
    if (window.innerWidth < 640)
        //return 350;
        return 500;
    else
        return 500;
}

var svg_map = d3.select(".svg_map_img"); // select correct svg

d3.json("Maps/regTopo.json", function(error, reg) {
    // read topojson file and calls a function
    // that takes as input the possible error and the file json itself
    if (error) return console.error(error); // if file not found print error on console
    //console.log(reg);
    //convert from topo to geo for display
    var subunits = topojson.feature(reg, reg.objects.regions);

    //projects spherical coordinate to a plane
    var projection = d3.geo.albers()
        .center([0, 41])
        .rotate([347, 0])
        .parallels([35, 45])
        .scale(screen_width()*5.4)
        .translate([screen_width() / 2, screen_width() / 1.71]);

    //path takes the projection and formats it appropriately
    var path = d3.geo.path()
        .projection(projection);

    // insert the map in the svg
    svg_map.selectAll(".subunit")
        .data(subunits.features)
        .enter()
        .append("path")
        .attr("class", function(d) {return "subunit " + d.id; })
        .attr("d", path)
        .on('mouseover', function(d){
            svg_map.append("text")
                .text(d.properties.NOME_REG)
                .attr("transform", "translate(" + path.centroid(d)[0]+", " + (path.bounds(d)[0][1])+ ")")
                .attr("dy", ".35em")
                .attr("class", "subunit-label " + d.properties.NOME_REG);
        })
        .on('mouseout', function(d){
            d3.selectAll("text").remove();
        });
});