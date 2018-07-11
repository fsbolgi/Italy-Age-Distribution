d3.select("body") // catch left and right arrow events
    .on('keydown', function () {
        var pos = document.getElementById("div_cursor").style.left;
        pos = Number(pos.substring(0, pos.length - 2));
        var movement = line_width / n_ages;
        if (d3.event.key == "ArrowLeft") {
            year_modification = true;
            if ((pos - movement) > points[0][0] - 18) {
                div_cursor.style('left', (pos - movement) + "px");
                var year = Number(text_cursor[0][0].textContent) - 1;
                move_index_tot_pop(year);
                move_index_n_births(year);
                text_cursor.text(year);
                set_col_name("A_" + year);
                compute_mean(curr_el, element.features);
                draw_histo(file_nameA, svg_histoA, "left");
                draw_histo(file_nameB, svg_histoB, "right");
            }
        } else if (d3.event.key == "ArrowRight") {
            year_modification = true;
            if ((pos + movement) < points[1][0] - 16) {
                div_cursor.style('left', (pos + movement) + "px");
                var year = Number(text_cursor[0][0].textContent) + 1;
                move_index_tot_pop(year);
                move_index_n_births(year);
                text_cursor.text(year);
                set_col_name("A_" + year);
                compute_mean(curr_el, element.features);
                draw_histo(file_nameA, svg_histoA, "left");
                draw_histo(file_nameB, svg_histoB, "right");
            }
        }
    });