const svgPie = d3.select("#pie-svg");

const canvasWidthPie = svgPie.node().getBoundingClientRect().width * 0.95;
const canvasHeightPie = svgPie.node().getBoundingClientRect().height;

const radius = canvasWidthPie/3;

const gPie = svgPie.append("g")
			 .attr("transform", "translate(" + svgPie.node().getBoundingClientRect().width/2 + ",0)");

const colorsPie = ['#fbb4ae','#b3cde3','#ccebc5','#decbe4'];
const colorsHoverPie = ['#e41a1c','#377eb8','#4daf4a','#984ea3'];

d3.csv("pie.csv", d => {d.percentage = Number(d.percentage); return d;}, (error, data) => {
	if (error)
		throw error;

	const cumu = [];
	const nonCumu = [];
	let last = 0;
	for (let i = 0; i < data.length; i++) {
		cumu.push(last);
		last += data[i].percentage / 100;
		nonCumu.push(data[i].percentage / 100);
	}
	cumu.push(1);

	const a = gPie.selectAll("none")
	 .data(nonCumu)
	 .enter()
	  .append("rect")
	  .attr("width", (d, i) => d * canvasWidthPie)
	  .attr("height", 200)
	  .attr("x", (d, i) => (-0.5 + cumu[i]) * canvasWidthPie)
	  .attr("fill", (d, i) => colorsPie[i])
	  .attr("id", (d, i) =>"part-" + i)
	  .on('mouseover', (d, i) => {
	  	d3.select("#part-" + i).transition()
	  	 .duration(200)
	  	 .attr("fill", colorsHoverPie[i])
	  })
	  .on('mouseout', (d, i) => {
	  	d3.select("#part-" + i).transition()
	  	 .duration(200)
	  	 .attr("fill", colorsPie[i])
	  });

	gPie.selectAll("none")
	 .data(data)
	 .enter()
	  .append("text")
	  .attr("transform", (d, i) => "translate(" + ((-0.5 + (cumu[i] + cumu[i+1])/2) * canvasWidthPie + 4) + "," + canvasHeightPie/2 + ")rotate(-90)")
	  .attr("text-anchor", "middle")
	  .text(d => d.text);
});