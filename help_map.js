function extract_features(json_el) {
    switch (level) {
        case 0:
            return json_el.objects.regions;
        case 1:
            return json_el.objects.provinces;
        case 2:
            return json_el.objects.municipalities;
    }
}

function extract_properties(curr_el) {
    var nome, cod;
    switch (level) {
        case 0:
            nome = curr_el.properties.NOME_REG.toUpperCase();
            cod = curr_el.properties.COD_REG;
            break;
        case 1:
            nome = curr_el.properties.NOME_PRO.toUpperCase();
            cod = curr_el.properties.COD_PRO;
            break;
        case 2:
            nome = curr_el.properties.NOME_COM.toUpperCase();
            cod = curr_el.properties.COD_COM;
            break;
    }
    return [nome, cod];
}

function compute_bounding_box(element) {
    var bounding_box = path_map.bounds(element);
    var box_width = bounding_box[1][0] - bounding_box[0][0],
        box_height = bounding_box[1][1] - bounding_box[0][1],
        box_center_x = (bounding_box[0][0] + bounding_box[1][0]) / 2,
        box_center_y = (bounding_box[0][1] + bounding_box[1][1]) / 2;
    return [box_width, box_height, box_center_x, box_center_y];
}

function scale_map() {
    var box = compute_bounding_box(previous_el);
    return Math.min(size_svg * 0.92 / box[0], size_svg * 0.92 / box[1]);
}

function translate_map() {
    var box = compute_bounding_box(previous_el);
    return [size_svg / 2 - scale * box[2], size_svg / 2 - scale * box[3]];
}