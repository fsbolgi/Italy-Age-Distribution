function screen_width() {
    if (window.outerWidth < 640)
        return 350;
    else
        return 500;
}

var projection = d3.geoEquirectangular()
    .scale(screen_width()/7)
    .translate([screen_width()/2,screen_width()/2]);

var path = d3.geoPath()
    .projection(projection);

var svg = d3.select(".svg_map_img");

var graticule = d3.geoGraticule();

svg.insert("path", "graticule")
    .datum(topojson.object(worldtopo1, worldtopo1.objects.land))
    .attr("class", "land")
    .attr("d", path);

/*svg.append("g")
    .attr("class", "graticule")
    .selectAll("path")
    .data(graticule.lines)
    .enter().append("path")
    .attr("d", path);*/

/*svg.insert("path", ".graticule")
    .datum(topojson.mesh(worldtopo1, worldtopo1.objects.countries, function(a, b) { return a.id !== b.id; }))
    .attr("class", "boundary")
    .attr("d", path);*/




/*var json = d3.json("ITA_adm1.json", function(data) {
    console.log(data[0]);
});*/


/*svg.selectAll(".graticule")
    .data([topojson.object(worldtopo, worldtopo.objects.land)])
    .enter()
    .append("path")
    .attr("class", "land")
    .attr("d", path);*/