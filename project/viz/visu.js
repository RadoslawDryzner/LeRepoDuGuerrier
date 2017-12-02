const dummy = [
	{year: 1910, value: 0.4},
	{year: 1911, value: 0.2},
	{year: 1940, value: 0.6},
	{year: 1990, value: 0.7},
	{year: 2017, value: 0.8}
]

const svg = d3.select("svg");

const margin = 30;
const canvasWidth = svg.node().clientWidth - 2 * margin;
const canvasHeight = svg.node().clientHeight - 2 * margin;

const g = svg.append("g")
			 .attr("transform", "translate(" + margin + "," + margin + ")");

let scaleX = d3.scaleLinear()
			   .rangeRound([0, canvasWidth])
			   .domain([1900, 2020]);

let scaleY = d3.scaleLinear()
			   .rangeRound([canvasHeight, 0])
			   .domain([0, 1]);

let line = d3.line()
    		 .x(function(d) { return scaleX(d.year); })
    		 .y(function(d) { return scaleY(d.value); });

g.append("path")
 .datum(dummy)
 .attr("fill", "none")
 .attr("stroke", "black")
 .attr("d", line);

g.append("g")
 .attr("transform", "translate(0," + canvasHeight + ")")
 .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")));

g.append("g")
 .call(d3.axisLeft(scaleY));