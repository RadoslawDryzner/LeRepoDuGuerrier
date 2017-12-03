const svg = d3.select("svg");

const margin = 30;
const canvasWidth = svg.node().getBoundingClientRect().width - 2 * margin;
const canvasHeight = svg.node().getBoundingClientRect().height - 2 * margin;

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
    		 .y(function(d) { return scaleY(d.value); })
    		 .curve(d3.curveMonotoneX);

d3.csv('testGenerate.php', data => {
	g.append("path")
	 .datum(data)
	 .attr("fill", "none")
	 .attr("stroke", "black")
	 .attr("d", line);

	g.append("g")
	 .attr("transform", "translate(0," + canvasHeight + ")")
	 .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")));

	g.append("g")
	 .call(d3.axisLeft(scaleY));
});