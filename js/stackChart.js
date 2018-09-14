const margin = {
  top: 20, right: 160, bottom: 45, left: 60,
};

const width = 1100 - margin.left - margin.right;


const height = 650 - margin.top - margin.bottom;

const svg = d3.select('body')
  .append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left + 20},${margin.top})`);


/* Data in strings like it would be if imported from a csv */

d3.json('./json/theftOutput.json', (data) => {
  const parse = d3.time.format('%Y').parse;


  // Transpose the data into layers
  const dataset = d3.layout.stack()(['Over$500', '$500AndUnder'].map(fruit => data.map(d => ({ x: parse(d.Year), y: +d[fruit] }))));


  // Set x, y and colors
  const x = d3.scale.ordinal()
    .domain(dataset[0].map(d => d.x))
    .rangeRoundBands([10, width - 10], 0.02);

  const y = d3.scale.linear()
    .domain([0, d3.max(dataset, d => d3.max(d, d => d.y0 + d.y))])
    .range([height, 0]);

  const colors = ['#031D44', '#04395E'];


  // Define and draw axes
  const yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .ticks(5)
    .tickSize(-width, 0, 0)
    .tickFormat(d => d);

  const xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')
    .tickPadding(10)
    .tickFormat(d3.time.format('%Y'));

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);
  svg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle', 'blue')
    .text('Count')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold');


  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);
  svg.append('text')
    .attr('transform', `translate(${width / 2.2} ,${height + margin.bottom})`)
    .style('text-anchor', 'start')
    .style('stroke', '#2e2d4d')
    .text(' - Year')
    .attr('font-size', '16px', margin.top);


  // Create groups for each series, rects for each segment
  const groups = svg.selectAll('g.cost')
    .data(dataset)
    .enter().append('g')
    .attr('class', 'cost')
    .style('fill', (d, i) => colors[i]);

  const rect = groups.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', d => x(d.x))
    .attr('y', d => y(d.y0 + d.y))
    .attr('height', d => y(d.y0) - y(d.y0 + d.y))
    .attr('width', x.rangeBand())
    .on('mouseover', () => { tooltip.style('display', null); })
    .on('mouseout', () => { tooltip.style('display', 'none'); })
    .on('mousemove', function (d) {
      const xPosition = d3.mouse(this)[0] - 15;
      const yPosition = d3.mouse(this)[1] - 25;
      tooltip.attr('transform', `translate(${xPosition},${yPosition})`);
      tooltip.select('text').text(d.y);
    });


  // Draw legend
  const legend = svg.selectAll('.legend')
    .data(colors)
    .enter().append('g')
    .attr('class', 'legend')
    .attr('transform', (d, i) => `translate(30,${i * 19})`);

  legend.append('rect')
    .attr('x', width - 18)
    .attr('width', 18)
    .attr('height', 18)
    .style('fill', (d, i) => colors.slice()[i]);

  legend.append('text')
    .attr('x', width + 5)
    .attr('y', 9)
    .attr('dy', '.35em')
    .style('text-anchor', 'start')
    .text((d, i) => {
      switch (i) {
        case 0: return 'Over$500';
        case 1: return '$500AndUnder';
      }
    });


  // Prep the tooltip bits, initial display is hidden
  var tooltip = svg.append('g')
    .attr('class', 'tooltip')
    .style('display', 'none');

  tooltip.append('rect')
    .attr('width', 30)
    .attr('height', 20)
    .attr('fill', 'white')
    .style('opacity', 0);

  tooltip.append('text')
    .attr('x', 15)
    .attr('dy', '1.2em')
    .style('text-anchor', 'middle')
    .attr('font-size', '12px')
    .attr('fill', 'white')
    .attr('font-weight', 'bold');
});
