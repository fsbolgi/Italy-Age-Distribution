function time_color_scales () {
    var past_scale = d3.scale.linear().domain([1,30])
        .interpolate(d3.interpolateHcl) // interpolate red color scale
        .range([d3.rgb("#ffcc00"), d3.rgb('#b30000')]);
    var present_scale = d3.scale.linear().domain([1,35])
        .interpolate(d3.interpolateHcl) // interpolate green color scale
        .range([d3.rgb("#99ff33"), d3.rgb('#006600')]);
    var future_scale = d3.scale.linear().domain([1,48])
        .interpolate(d3.interpolateHcl) // interpolate blue color scale
        .range([d3.rgb("#99ccff"), d3.rgb('#000099')]);

    var color_scale = new Array(114); // insert interpolated color in array
    for (i = 0; i<31; i++){
        color_scale[i] = past_scale(i);
    }
    for (i = 0; i<36; i++){
        color_scale[i+30] = present_scale(i);
    }
    for (i = 0; i<49; i++){
        color_scale[i+66] = future_scale(i);
    }
    return color_scale;
}