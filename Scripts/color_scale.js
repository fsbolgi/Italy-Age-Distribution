function time_color_scales () {
    var color_scale = new Array(114); // insert interpolated color in array
    for (i = 0; i<31; i++){
        color_scale[i] = "#f3b748";
    }
    for (i = 0; i<36; i++){
        color_scale[i+30] = "#62cc9a";
    }
    for (i = 0; i<49; i++){
        color_scale[i+66] = "#388393";
    }
    return color_scale;
}