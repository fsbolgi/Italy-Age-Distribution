function screen_width() {
    if (window.outerWidth < 640)
        return 350;
    else
        return 500;
}

/*var projection = d3.geoEquirectangular()
    .scale(screen_width()/7)
    .translate([screen_width()/2,screen_width()/2]);

var path = d3.geoPath()
    .projection(projection);*/

var svg1 = d3.select(".svg_map_img");

d3.json("itx.json", function(it) {
    var projection = d3.geo.albers()
        .center([0, 41])
        .rotate([347, 0])
        .parallels([35, 45])
        .scale(screen_width()*5)
        .translate([screen_width() / 2, screen_width() / 2]);

    var subunits = topojson.feature(it, it.objects.sub);

    var path = d3.geo.path()
        .projection(projection);

    // draw border with sea
    svg1.append("path")
        .datum(topojson.mesh(it, it.objects.sub, function(a, b) { return a === b ; }))
        .attr("class", "border_map")
        .attr("d", path);
    // draw all the features together (no different styles)
    svg1.append("path")
        .datum(subunits)
        .attr("class", "map")
        .attr("d", path);
    // draw and style any feature at time
    /*svg.selectAll("path")
    .data(topojson.feature(it, it.objects.sub).features)
    .enter().append("path")
    .attr("class",function(d) { return d.id; })
    .attr("d",path);*/
    // draw TORINO border (i.e. the border of a given feature)
    svg1.append("path")
        .datum(topojson.mesh(it, it.objects.sub, function(a, b) { return b.id === 'TORINO' || a.id === 'TORINO'; }))
        .attr("class", "torino_map")
        .attr("d", path);
});

/*var graticule = d3.geoGraticule();*/

 ////OPTION 1 works for globe
/*svg.selectAll(".graticule")
    .data([topojson.object(worldtopo1, worldtopo1.objects.land)])
    .enter()
    .append("path")
    .attr("class", "land")
    .attr("d", path);*/

/* ////OPTION 2 works for globe
svg.insert("path", "graticule")
    .datum(topojson.object(worldtopo1, worldtopo1.objects.land))
    .attr("class", "land")
    .attr("d", path);*/ // this one works for globe

/*var json = d3.json("ITA_adm1.json", function(data) {
    console.log(data[0].object);
});*/