var width = 600,
    height = 550,
    svg_histoA = d3.select(".histoA_svg"),
    svg_histoB = d3.select(".histoB_svg"),
    start = 2,
    year_modification = false;

/*
    dataset: DCIS_RICPOPRES1971 : popolazione residente ricostruita - Anni 1952-1971 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Età, Sesso(1=M, 2= F), Periodo) -- No Prov e Mun
    dataset: DCIS_RICPOPRES1981 : popolazione residente ricostruita - Anni 1972-1981 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Età, Sesso(1=M, 2= F), Periodo) -- No Prov e Mun

    dataset: DCIS_RICPOPRES1991 : popolazione residente ricostruita - Anni 1982-1991 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Età, Sesso(1=M, 2= F), Periodo) -- All
    dataset: DCIS_RICPOPRES2001 : popolazione residente ricostruita - Anni 1991-2001 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Età, Sesso(1=M, 2= F), Periodo) -- All
    dataset: DCIS_RICPOPRES2011 : popolazione residente ricostruita - Anni 2001-2011 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Età, Sesso(1=M, 2= F), Cittadinanza(7=tot), Periodo) -- All

    dataset: DCIS_POPRES1 : popolazione residente al 1 gennaio - Anni 2012 -2017 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Sesso(1=M, 2= F), Età, Sposato(8=tot), Periodo) -- All

    dataset: DCIS_PREVDEM1 : previsioni della popolazione - Anni 2017-2065 - (Territorio, Indicatore demografico(1=popolazione al 1/01), Previsione(5=Mediana), Età, Sesso(1=M, 2= F), Periodo) -- No Prov e Mun

example: period 1952-1971, Territorio=italy, age=zero, sesso=M,
// http://apistat.istat.it/?q=getdatajsonnuts&dataset=DCIS_RICPOPRES1971&dim=1,1,1,1,0&lang=0
*/

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

var col_name = "A_1982",
    file_nameA = "Data/Male/ITALIA.csv",
    file_nameB = "Data/Female/ITALIA.csv";

draw_histo(file_nameA, svg_histoA, "left");
draw_histo(file_nameB, svg_histoB, "right");

function set_col_name(new_col_name) {
    col_name = new_col_name;
}

function draw_histo(path_data, svg_histo, pos) {

    d3.csv(path_data, type, function (error, data) {

        var tot_pop = d3.sum(data, function (d) {
            return d.value;
        });

        curr_max = 0;
        var save_col_name = col_name;
        var max = 0;

        var cols = d3.keys(data[0]);

        for (i = 1; i < cols.length - 1; i++) {
            col_name = cols[i];
            data.forEach(function (d) {
                d.col = +d[col_name];
            });

            max = d3.max(data, function (d) {
                return d.col;
            });
            if (max > curr_max) {
                curr_max = max;
            }
        }
        col_name = save_col_name;

        console.log(curr_max);
        var xScale = d3.scale.linear()
            .domain([0, curr_max])
            .range([0, width / 2 - 10]);

        var bar_height = (height) / ages_array.length;

        var rect = svg_histo.selectAll("rect")
            .data(data);

        rect.enter()
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
                return i * (height) / data.length;
            });

        rect.transition()
            .delay(function () {
                return (start > 0) ? 800 : 0;
            })
            .duration(function () {
                return year_modification ? 100 : 1000;
            })
            .attr("width", function (d) {
                return xScale(d.value);
            })
            .attr("x", function (d) {
                if (pos == "left") {
                    return (width / 2 - (xScale(d.value) + 5));
                } else {
                    return 5;
                }
            });
        if (!year_modification) {
            start--;
        }

        rect.on('mouseover', function () {
            d3.select(this).style("opacity", 1);
            tooltip.style("visibility", "visible");
        })
            .on('mouseout', function () {
                d3.select(this).style("opacity", .7);
                tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function (d, i) {
                tooltip.style("top", (event.pageY - 15) + "px")
                    .style("left", (event.pageX + 17) + "px")
                    .html("&nbsp<strong>Age:</strong> " + i + "<br>" +
                        "&nbsp<strong>Value:</strong> " + d.value + "<br>" +
                        "&nbsp<strong>Rate:</strong> " + Math.round((d.value * 10000 / tot_pop)) / 100 + "%");
            });
    });
}

function type(d) {
    d.value = +d[col_name];
    return d;
}