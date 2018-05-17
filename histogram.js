var width = 600;
var height = 550;
var svg_histoA = d3.select(".histoA_svg");
var svg_histoB = d3.select(".histoB_svg");

//from api: data set from 1991-2001 at:
// http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1991&dim=1,1,1,1,1559&lang=0
/*
    dataset: DCIS_RICPOPRES1971 : popolazione residente ricostruita - Anni 1952-1971
    dataset: DCIS_RICPOPRES1981 : popolazione residente ricostruita - Anni 1972-1981

    dataset: DCIS_RICPOPRES1991 : popolazione residente ricostruita - Anni 1982-1991
    dataset: DCIS_RICPOPRES2001 : popolazione residente ricostruita - Anni 1991-2001
    dataset: DCIS_RICPOPRES2011 : popolazione residente ricostruita - Anni 2001-2011

    dataset: DCIS_POPRES1 : popolazione residente al 1 gennaio - Anni 2012 -2017

    dataset: DCIS_PREVDEM1 : previsioni della popolazione - Anni 2017-2065

    dim: 1) 1 campo territorio, 1 è Cod Italia
         2) 1 tipo di indicatore demografico, 1 è Cod per popolazione al 1^ gennaio
    \\   2.5) per previsioni c'è campo in più "Intervallo di previsione"
         3) 1 età, 1 è il Cod per zero anni
         4) 1 sesso, 1 è Cod per maschi
         4.5) per dati 2012-2017 c'è stato maritale
         5) 1559 seleziona periodo, 1559 è il codice per 1982
    */

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

//var header = "https://cors-anywhere.herokuapp.com/";
var header = "https://cryptic-headland-94862.herokuapp.com/"; // does the same

var linkA = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1991&dim=1,1,0,1,1559&lang=0";
var linkB = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1991&dim=1,1,0,2,1559&lang=0";

draw_histo(linkA, svg_histoA, "left");
draw_histo(linkB, svg_histoB, "right");

function draw_histo(link, svg_histo, pos) {

    d3.json(header + link, function (error, data) {

        var ages_array = data.IDETA1.value;

        ages_array[ages_array.length - 1] = 0;

        var max = d3.max(ages_array, function (d) {
            return d;
        });

        var xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width / 2 - 10]);

        var bar_height = (height) / ages_array.length;

        var rect = svg_histo.selectAll("rect")
            .data(ages_array)
            .enter()
            .append("rect")
            .attr("width", 0)
            .attr("height", bar_height)
            .attr("x", function (d) {
                if (pos == "left") {
                    return 290;
                } else {
                    return 10;
                }
            })
            .attr("y", function (d, i) {
                return i * (height) / ages_array.length;
            });
        rect.transition()
            .duration(1000)
            .attr("width", function (d) {
                return xScale(d);
            })
            .attr("x", function (d) {
                if (pos == "left") {
                    return (width / 2 - (xScale(d) + 5));
                } else {
                    return 5;
                }
            });
        rect.on('mouseover', function (d) {
            d3.select(this).style("opacity", 1);
            return tooltip.style("visibility", "visible");
        })
            .on('mouseout', function (d) {
                d3.select(this).style("opacity", .7);
                return tooltip.style("visibility", "hidden");
            })
            .on("click", function (d) {
                console.log(d);
            })
            .on("mousemove", function (d, i) {
                return tooltip
                    .style("top", (event.pageY - 15) + "px")
                    .style("left", (event.pageX + 17) + "px")
                    .html("&nbsp &nbsp<strong>Age:</strong> " + i + "<br> <strong>Value:</strong> " + d);
            });
    });
}