var mySound;

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function () {
        this.sound.play();
    }
    this.stop = function () {
        this.sound.pause();
    }
}

function easter() {
    var svg_lj = d3.select(".lajatico_svg");
    var img_ab = svg_lj.append("svg:image")
        .attr("xlink:href", "Images/bocelli.jpg")
        .attr("class", "image")
        .attr("x", 800)
        .attr("y", 100)
        .attr("width", 500)
        .attr("height", 500);
    var img_glasses = svg_lj.append('svg:image')
        .attr("xlink:href", "Images/glasses.png")
        .attr("class", "image")
        .attr("x", 940)
        .attr("y", 50)
        .attr("width", 190)
        .attr("height", 180);
    mySound = new sound("song.mp3");
    mySound.play();
    on_lajatico();
    img_ab.transition().delay(10000).duration(500).style("opacity", 1);
    img_glasses.transition().delay(10000).duration(5000).style("opacity", 1).attr("y", 130);
}