function drawArea() {

    var margin = {
        top: 60,
        right: 100,
        bottom: 40,
        left: 100
    }

    var width = document.getElementById('AreaChartDiv').clientWidth - margin.left - margin.right;
    var height = 600 - margin.top - margin.bottom;

    var svg = d3.select("#AreaChartDiv").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g");

    var parseYear = d3.timeParse("%Y");

    var x = d3.scaleTime().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
    var z = d3.scaleOrdinal()
        //Here are the colours in the graph.
        //It is used for the fill and stroke in 'path' for arc
        .domain(d3.range(19))
        .range(['#52D7F9', '#2ADFEF', '#09E7E0', '#27EDCE', '#4DF1B9', '#71F5A3', '#93F68D', '#B5F779', '#D6F568', '#F27E6B', '#F97E80', '#FC8197', '#F987AE', '#F191C4', '#E29CD8', '#CEA9E9', '#B5B5F5', '#98C1FC', '#76CDFD', ]);

    var stack = d3.stack();

    //For the main area stack, the bottom y value is affected by what comes before it.
    var area = d3.area()
        .x(function(d, i) {
            return x(d.data.Year);
        })
        .y0(function(d) {
            return y(d[0]);
        })
        .y1(function(d) {
            return y(d[1]);
        });

    //This is the area for when the chart is hovered
    var singleArea = d3.area()
        .x(function(d, i) {
            return x(d.data.Year);
        })
        .y0(height)
        //This makes sure the y axis starts flat
        .y1(function(d) {
            return y(d[1] - d[0]);
        });

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("FilmVisualisation/TotalByYearProportion1980Up.csv", type, function(error, data) {
        if (error) throw error;

        //The keys are used to identify which genre is being accessed.
        var keys = data.columns.slice(1);

        x.domain(d3.extent(data, function(d) {
            return d.Year;
        }));
        z.domain(keys);

        //Stack order is Ascending.
        stack.order(d3.stackOrderAscending);
        stack.keys(keys);

        var layer = g.selectAll(".layer")
            .data(stack(data))
            .enter().append("g")
            //Give a unique id to each layer
            .attr("id", function(d) {
                return "layer-" + d.key
            })
            .attr("class", "layer");

        layer.append("path")
            .attr("class", "area")
            .style("fill", function(d) {
              //fill using the colour index of the key
                return z(d.key);
            })
            .attr("d", area)
            .style("stroke", "none");


        layer.on("mouseenter", function(d, g) {
          //Make all the areas opaque
                d3.selectAll(".area").style("opacity", 0.2)
          //Create a new path from the key hovered on
                d3.select("#layer-" + d.key).insert("path")
                    .style("fill", function(d) {
                        return z(d.key);
                    })
                    .attr("d", singleArea(d))
                    //Give unique id to this area
                    .attr("id", function(d) {
                        return d.key
                    });
                //Create a text label to appear with the new area
                d3.select("#layer-" + d.key).insert("text")
                    .style("fill", "white")
                    .style("text-anchor", "middle")
                    .attr("x", width / 2)
                    .attr("y", function(d) {
                        return y((d[d.length - 1][1]/2 ));
                    })
                    .text(function(d) {
                        return d.key;
                    })
                    .attr("id", function(d) {
                        return d.key
                    });

            })
            .on("mouseleave", function(d) {
                //Set opacity back to normal
                d3.selectAll(".area").style("opacity", 1)
                //Remove the newly made text and area
                d3.select("#" + d.key).remove()
                d3.select("#" + d.key).remove();
            });

        //Here is the start of the layer.filter for the labels for the areas.
        //Use the filter to place the layers individually at the bottom so that they all fit on the graph.
        //As a bigger text appears on hover the font-size isn't a big issue.
        layer.filter(function(d) {
                return d.index > 6
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2);
            })
            .attr("dy", ".35em")
            .style("font", "10px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });
        layer.filter(function(d) {
                return d.index == 6
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) - 4.8;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });

        layer.filter(function(d) {
                return d.index == 5
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) + 0.1;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });
        layer.filter(function(d) {
                return d.index == 4
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) + 0.6;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });
        layer.filter(function(d) {
                return d.index == 3
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) - 0.7;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });
        layer.filter(function(d) {
                return d.index == 2
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) - 0.7;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });
        layer.filter(function(d) {
                return d.index == 1
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) + 2.4;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });

        layer.filter(function(d) {
                return d.index == 0
            })
            .append("text")
            .attr("x", width + 3)
            .attr("y", function(d) {
                return y((d[d.length - 1][0] + d[d.length - 1][1]) / 2) + 6.4;
            })
            .attr("dy", ".35em")
            .style("font", "8px sans-serif")
            .style("text-anchor", "start")
            .style("fill", function(d) {
                return z(d.key);
            })
            .text(function(d) {
                return d.key;
            });
        //End of genre labels.

        //Function for fading area.
        function fadeArea(opacity) {
            var area = this;
            console.log('fade');
            return function(g, i) {
                svg.selectAll("g.area path")
                    .filter(function(d) {
                        return this != area;
                    })
                    .transition()
                    .style("opacity", 0.2);
            };
        }
        //Append x-axis
        g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(16));

        //Append y-axis
        g.append("g")
            .call(d3.axisLeft(y).ticks(10, "%"));
    });

    function type(d, i, columns) {
        //Put year into date format
        d.Year = parseYear(d.Year);
        for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
        return d;
    }

    svg.append("text")
        .style('fill', 'white')
        .attr("x", (width / 2) + 70)
        .attr("y", 0 - (margin.top / 2) + 70)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("Annual Breakdown of 3651 Films Released by Genre");
