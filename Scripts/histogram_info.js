function set_col_name(new_col_name) {
    col_name = new_col_name;
}

function draw_histo_label() { // insert  age values and bars' tooltip

    for (i = 0; i <= 100; i++) { // create an array with values from 0 to 99
        ages_array[i] = i;
    }

    var ages_name = svg_histoB.selectAll("text") // insert ages labels
        .data(ages_array)
        .enter()
        .append("text")
        .text(function (d) {
            return (d % 5 == 0)? d : ""; // insert only every 5 ages
        })
        .attr("dx", function (d) {
            if (d < 10) {
                return 10;
            } else if (d == 100) {
                return 4;
            } else {
                return 7;
            }
        })
        .attr("dy", function (d, i) {
            return 555 - (5.3 * i + 17);
        })
        .attr("class", "year_label");

    ages_name.transition() // transition on enter
        .duration(0)
        .delay(function (d, i) {
            return 1000 + i * 9;
        })
        .style("opacity", 1);

    tooltip_histo = d3.select("body") // tooltip histogram
        .append("div")
        .attr("class", "tooltip");
}