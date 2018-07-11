# AGE DISTRIBUTION IN ITALY

This project was done for the exam of Scientific and Large Data Visualization in the 
master degree of Computer Science in the University of Pisa.

It's an interactive tool to visualize the distribution of the Italian population in the 
period from 1952 to 2065. It is possible to inspect the data relative to the national 
territory, the regions and, for the restricted period of 1982-2017, the provinces and the 
municipalities.

You can take a look [here](https://fsbolgi.github.io/Sciviz/homepage.html) to see the 
project in action.

## STRUCTURE

The page is structured as:
* top - It contains the hierarchy of the places you're currently seeing. You can use that
just as a remainder of the path you went down or to zoom out back to Italy. Another way to 
zoom out is by clicking on the magnifier or on the white space surrounding the map. In 
order to get a more general idea of the distribution you can decide to reduce the number of
bars in the histogram by grouping them.
* middle left - In this section there are some global information about the place 
visualized. You can either check the trend of the total population or the number of births
in the maximum interval available. To make it easier to anyalize a small white dot marks
the value in the current year. Moreover it's possible to visualize the charts showing the 
data in the interval from 0 to maximum or from minimum to maximum. In the first case 
it's easier to understand the actual value, while in the second more attention is payed to 
the perturbations in the data.
* middle center - Here you can visalize the map of the place. You can navigate through the
many levels of precision by clicking on the area you want to deepen. The colors in the map
show the differences in the average age. A grey color symbolize that there are no
data available for that place while a uniform color in all the places means that the data 
is not available just for that period. By hovering on a place you can read the name of 
a place in the tooltip and in the histogram it will appear the contribution of that place to 
the total population. 
* middle right - This part contains the timeline and the histogram. The first allows you 
to move around different periods of time, you can do it either by dragging the cursor, using 
the arrow keys or simply by clicking on the "play" button. The past and future sections are 
available only for the whole nation and for the regions. The histogram shows the number of 
people present for each age (from 0 to 99) in that place. The blue part on the left 
represent the male population while the pink one the females. The darker horizontal line 
indicates the average age. 

## TOOLS

The main tools I used to realize this project are:
* [d3.js](https://d3js.org/) - The JavaScript library D3.js is useful for manipulating 
documents based on data. D3 allows you to bind arbitrary data to a DOM, and then apply 
data-driven transformations to create interactive and smooth transitions. 
* [istat](https://www.istat.it/) - Istat is the italian national institute for statistics.
The data I worked with is under the "Population and Households" section. In particular I 
took from "Inter censuses population" the reconstructed data from 1952 to 1981 and from 
1982 to 2010, in "Population/Resident population on 1st January" I took the data from 2011 
to 2017, while the forecast from 2018 to 2065 are taken from the "Demographic projections".

## USEFUL LINKS

Below there's a list of examples and tutorials I found useful to understand how to do 
some functionalities of the project.
* [topojson files](https://github.com/Dataninja/geo-shapes) -  A set of well formatted data 
needed to draw the map.
* [istat api](https://medium.com/@vincpatruno/come-accedere-ai-dati-statistici-pubblicati-dallistituto-nazionale-di-statistica-istat-ca874316f5a9) 
- An automated way to retrieve or download the data from istat. 
* [draw a map](https://bost.ocks.org/mike/map/) - A simple tutorial on how to draw a map 
using d3.js
* [zoom to bounding box](https://bl.ocks.org/mbostock/4699541) - An example on how to zoom 
in and out centering the on a place on the map.
* [read from csv](https://bost.ocks.org/mike/bar/2) - A basic tutorial on how to read from 
csv using d3.js and expoit the data to draw a bar chart.
* [color scale](http://bl.ocks.org/jfreyre/b1882159636cc9e1283a) - A function to 
interpolate a scale of colors.
* [tooltip](http://bl.ocks.org/biovisualize/1016860) - A little project on how to append a 
tooltip cointaing some information to the mouse position.

## License

This project is licensed under the MIT License.

The data used was taken from the istat database. 
For the provinces and municipalities are available the data from 1982 to 2017, while for the regions it is also possible to see the reconstructed population from 1952 to 1981 and the forecasts until 2065.



