function screen_width() {
    if (window.innerWidth < 640)
        return 350;
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
        .scale(screen_width()*5.5)
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
        .attr("d", path);

    svg_map.selectAll(".subunit-label")
        .data(subunits.features)
        .enter().append("text")
        .attr("class", function(d) { return "subunit-label " + d.id; })
        .attr("transform", function(d) { return "translate(" + path.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .text(function(d) { return d.properties.NOME_REG; });


});