function insert_info_tooltip() {

    var info_i = svgB_header.append("text") // draw the icon
        .text("i")
        .attr("fill", "#f7f6ee")
        .attr("dx", 550)
        .attr("dy", 52)
        .attr("class", "info_i");
    var info_circle = svgB_header.append("circle")
        .attr("cx", 553)
        .attr("cy", 45)
        .attr("class", "info_button")
        .on("click", function () {
            on();
        });

    info_i.transition().delay(800).duration(1000).style("opacity", 1); // on enter label transition
    info_circle.transition().delay(800).duration(1000).style("opacity", 1); // on enter values transition
}

function on() { // make overlay appear
    document.getElementById("overlay").style.display = "block";
}

function off() { // remove overlay
    document.getElementById("overlay").style.display = "none";
}

function on_lajatico() { // make overlay appear
    document.getElementById("overlay_lajatico").style.display = "block";
}

function off_lajatico() { // remove overlay
    document.getElementById("overlay_lajatico").style.display = "none";
}