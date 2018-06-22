function insert_info_tooltip() {

    svgB_header.append("text") // draw the icon
        .text("i")
        .attr("fill", "#f7f6ee")
        .attr("dx", 550)
        .attr("dy", 52)
        .attr("class", "info_i");
    svgB_header.append("circle")
        .attr("cx", 553)
        .attr("cy", 45)
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