
const margin = {
  top: 20, right: 20, bottom: 40, left: 70,
};


const width = 1100 - margin.left - margin.right;


const height = 600 - margin.top - margin.bottom;

const parseTime = d3.timeParse('%Y');

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const valueline1 = d3.line()
  .x(d => x(d.Year))
  .y(d => y(d.AssaultCases));

const valueline2 = d3.line()
  .x(d => x(d.Year))
  .y(d => y(d.Arrested));

const valueline3 = d3.line()
  .x(d => x(d.Year))
  .y(d => y(d.NotArrested));

const svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom);

const group = svg.append('g')
  .attr('transform',
    `translate(${margin.left},${margin.top})`);

d3.json('../json/outputassault.json', (error, data) => {
  if (error) throw error;


  data.forEach((d) => {
    d.Year = parseTime(d.Year);
    d.Arrested = +d.Arrested;
    d.AssaultCases = +d.AssaultCases;
    d.NotArrested = +d.NotArrested;
  });

  x.domain(d3.extent(data, d => d.Year));

  y.domain([0, d3.max(data, d => d.AssaultCases) * 1.005]);

  group.append('path')
    .data([data])
    .attr('class', 'line1')
    .attr('d', valueline1);
  // Add the valueline path.
  group.append('path')
    .data([data])
    .attr('class', 'line2')
    .attr('d', valueline2);

  group.append('path')
    .data([data])
    .attr('class', 'line3')
    .attr('d', valueline3);


  group.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x));

  group.append('text')
    .attr('transform', `translate(${width / 12} ,${height + margin.bottom})`)
    .style('text-anchor', 'start')
    .style('stroke', '#031D44')
    .text(' - No. of Assault cases')
    .attr('font-size', '14px');
  group.append('text')
    .attr('transform', `translate(${width / 3} ,${height + margin.bottom})`)
    .style('text-anchor', 'start')
    .style('stroke', '#70A288')
    .text(' - No. of not arrested in Assault cases')
    .attr('font-size', '14px');
  group.append('text')
    .attr('transform', `translate(${width / 1.5} ,${height + margin.bottom})`)
    .style('text-anchor', 'start')
    .style('stroke', '#04395E')
    .text(' - No. of arrested in Assault cases')
    .attr('font-size', '14px');


  // Add the Y Axis
  group.append('g')
    .call(d3.axisLeft(y));

  group.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left)
    .attr('x', 0 - (height / 2))
    .attr('dy', '1em')
    .style('text-anchor', 'middle')
    .text('Count')
    .attr('font-size', '14px')
    .attr('font-weight', 'bold');

  // console.log(data);
});
