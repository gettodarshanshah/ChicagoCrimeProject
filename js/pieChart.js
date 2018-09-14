const svg = d3.select('svg');

//Fetching height and width from svg component.

const w = svg.attr('width');


const h = svg.attr('height');


const r = (Math.min(w, h) / 2) - 40;

const color = d3.scaleOrdinal(['#031D44', '#04395E', '#70A288', '#DAB785', '#D5896F']);

//appending components to svg and providing the layout of chart type.

const group = svg.append('g')
  .attr('transform', `translate(${(w / 2) + 100},${h / 2})`);

const pie = d3.pie()
  .value(d => d.Count);

const path = d3.arc()
  .outerRadius(r - 10)
  .innerRadius(0);

const label = d3.arc()
  .outerRadius(r)
  .innerRadius(100);

//taking input from json file and plotting chart.

d3.json('../json/pieChartData.json',
  (error, data) => {
    if (error) {
      throw error;
    }

    const arcs = group.selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arcs.append('path')
      .attr('d', path)
      .attr('data-legend', d => d.data.Type)
      .attr('data-legend-pos', (d, i) => i)
      .attr('fill', d => color(d.data.Type));

    // console.log(arcs);

    //Providing legends and labels to denote sections in chart
    arcs.append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .text(d => `${d.data.Type} : ${d.data.Count}`)
      .attr('style', 'font-size:12px;font-weight : bold;color: white');
  });

// Chart Heading

svg.append('g')
  .attr('transform', `translate(${w / 2},${20})`)
  .append('text')
  .text('2015 Crime Data Distribution')
  .attr('class', 'title');
