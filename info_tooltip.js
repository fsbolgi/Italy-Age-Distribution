function insert_info_tooltip(svg) {

    svg.append("text") // draw the icon
        .text("i")
        .attr("fill", "#f7f6ee")
        .attr("dx", 82)
        .attr("dy", 552)
        .attr("class", "info_i");
    svg.append("circle")
        .attr("cx", 85)
        .attr("cy", 545)
        .attr("class", "info_button")
        .on("click", function () {
            on();
        });
}

function on() { // make overlay appear
    document.getElementById("overlay").style.display = "block";
}

function off() { // remove overlay
    document.getElementById("overlay").style.display = "none";
}