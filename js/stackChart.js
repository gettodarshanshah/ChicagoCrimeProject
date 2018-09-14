var margin = { top: 20, right: 160, bottom: 45, left: 60 };

var width = 1100 - margin.left - margin.right,
  height = 650 - margin.top - margin.bottom;

var svg = d3.select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + (margin.left +20) + "," + margin.top + ")");


/* Data in strings like it would be if imported from a csv */

d3.json("./json/theftOutput.json", function (data) {
  var parse = d3.time.format("%Y").parse;


  // Transpose the data into layers
  var dataset = d3.layout.stack()(["Over$500", "$500AndUnder"].map(function (fruit) {
    return data.map(function (d) {
      return { x: parse(d.Year), y: +d[fruit] };
    });
  }));



  // Set x, y and colors
  var x = d3.scale.ordinal()
    .domain(dataset[0].map(function (d) { return d.x; }))
    .rangeRoundBands([10, width - 10], 0.02);

  var y = d3.scale.linear()
    .domain([0, d3.max(dataset, function (d) { return d3.max(d, function (d) { return d.y0 + d.y; }); })])
    .range([height, 0]);

    const colors = ['#031D44', '#04395E'];


  // Define and draw axes
  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat(function (d) { return d });

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickPadding(10)
    .tickFormat(d3.time.format("%Y"));

  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
  svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle","blue")
            .text("Count")
            .attr("font-size", "14px")
            .attr("font-weight", "bold")
  

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  svg.append("text")
            .attr("transform", "translate(" + (width/2.2) + " ," + (height + margin.bottom) + ")")
            .style("text-anchor", "start")
            .style("stroke", "#2e2d4d")
            .text(" - Year")
            .attr("font-size", "16px",margin.top);
  


  // Create groups for each series, rects for each segment 
  var groups = svg.selectAll("g.cost")
    .data(dataset)
    .enter().append("g")
    .attr("class", "cost")
    .style("fill", function (d, i) { return colors[i]; });

  var rect = groups.selectAll("rect")
    .data(function (d) { return d; })
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.x); })
    .attr("y", function (d) { return y(d.y0 + d.y); })
    .attr("height", function (d) { return y(d.y0) - y(d.y0 + d.y); })
    .attr("width", x.rangeBand())
    .on("mouseover", function () { tooltip.style("display", null); })
    .on("mouseout", function () { tooltip.style("display", "none"); })
    .on("mousemove", function (d) {
      var xPosition = d3.mouse(this)[0] - 15;
      var yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr("transform", "translate(" + xPosition + "," + yPosition + ")");
      tooltip.select("text").text(d.y);
    });


  // Draw legend
  var legend = svg.selectAll(".legend")
    .data(colors)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) { return "translate(30," + i * 19 + ")"; });

  legend.append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function (d, i) { return colors.slice()[i]; });

  legend.append("text")
    .attr("x", width + 5)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d, i) {
      switch (i) {
        case 0: return "Over$500";
        case 1: return "$500AndUnder";
      }
    });


  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append("g")
    .attr("class", "tooltip")
    .style("display", "none");

  tooltip.append("rect")
    .attr("width", 30)
    .attr("height", 20)
    .attr("fill", "white")
    .style("opacity", 0);

  tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "white")
    .attr("font-weight", "bold");
}
)
