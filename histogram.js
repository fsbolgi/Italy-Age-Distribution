var age = [20, 40, 60, 80, 100, 120];
var nPeopleA = [8, 18, 30, 23, 12, 5, 2];
var nPeopleB = [6, 17, 22, 32, 14, 8, 5];
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

    dataset: DCIS_PREVDEM1 : previsioni della popolazione - Anni 2017-2065

    dim: 1) 1 campo territorio, 1 è Cod Italia
         2) 1 tipo di indicatore demografico, 1 è Cod per popolazione al 1^ gennaio
    \\   2.5) per previsioni c'è campo in più "Intervallo di previsione"
         3) 1 età, 1 è il Cod per zero anni
         4) 1 sesso, 1 è Cod per maschi
         5) 1559 seleziona periodo, 1559 è il codice per 1982
    */

var header = "https://cors-anywhere.herokuapp.com/";
// var header = "https://cryptic-headland-94862.herokuapp.com/"; // does the same

var linkA = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1991&dim=1,1,0,1,1559&lang=0";
var linkB = "http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1991&dim=1,1,0,2,1559&lang=0";

draw_histo(linkA, svg_histoA, "left");
draw_histo(linkB, svg_histoB, "right");

function draw_histo (link, svg_histo, pos){

    d3.json(header+link, function(error, data){

        var ages_array = data.IDETA1.value;

        ages_array[ages_array.length-1] = 0;

        var max = d3.max(ages_array, function (d) {
            return d;
        });

        var xScale = d3.scale.linear()
            .domain([0, max])
            .range([0, width / 2 - 30]);

        var bar_height = (height - 50) / ages_array.length;

        svg_histo.selectAll("rect")
            .data(ages_array)
            .enter()
            .append("rect")
            .attr("width", function (d) {
                return xScale(d);
            })
            .attr("height", bar_height)
            .attr("x", function (d) {
                if (pos=="left"){
                    return (width / 2 - (xScale(d) + 20));
                } else {
                    return 20;
                }
            })
            .attr("y", function (d, i) {
                return i * (height) / ages_array.length;
            })
            .on('mouseover', function (d) {
                d3.select(this).style("opacity", 1);
                svg_histo.append("text")
                    .text("value: " + d)
                    .attr("dx", this.x.animVal.value + 35)
                    .attr("dy", this.y.animVal.value + 15)
                    .attr("class", "histo_label");
            })
            .on('mouseout', function (d) {
                d3.select(this).style("opacity", .6);
                svg_histo.selectAll("text").remove();
            })
            .on("click", function (d) {
                console.log(d);
            });
    });
}