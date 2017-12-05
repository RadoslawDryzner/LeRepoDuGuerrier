let curves = [];

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

g.append("g")
 .attr("transform", "translate(0," + canvasHeight + ")")
 .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")));

g.append("g")
 .call(d3.axisLeft(scaleY));



let allGenres = [];
$.get("getAllGenres.php", function(data){
	allGenres = data;
},'json');

$("#btn-add").click(addCurve);

function addCurve() {
	let clone = $($("#curve-ui-template").clone()[0]);
	clone.attr("id", null);
	clone.attr("style", null);

	const genreInput = clone.find(".genre-typeahead");
	const wordInput = clone.find(".word-typeahead");

	const index = curves.length;

	genreInput.typeahead({source:allGenres});
	genreInput.change(function() {
		if (curves[index].genre == this.value) 
			return;
		curves[index].genre = this.value;

		$.get("getAllWords.php?genre=" + this.value, function(data){
			wordInput.typeahead('destroy')
			wordInput.typeahead({source:data});
		},'json');

		updateCurve(index);
	});
	wordInput.change(function(){
		if (curves[index].genre == this.value) 
			return;

		curves[index].word = this.value;
		updateCurve(index);
	});

	const removeButton = clone.find(".btn-remove");
	removeButton.click(() => {
		if (curves[index].path) {
			curves[index].path.remove();
			curves[index].path = null;
		}
		clone.attr("style", "display:none;");
	});

	curves.push({
		genre:"",
		word: "",
		noDataLabel: clone.find(".label-no-data")
	});

	$("#curves-ui").append(clone);
}

function updateCurve(i) {
	d3.csv("getWordData.php?genre=" + curves[i].genre + "&word=" + curves[i].word, data => {
		if (curves[i].path) {
			curves[i].path.remove();
			curves[i].path = null;
		}

		if (data.length > 0) {
			curves[i].noDataLabel.attr("style", "display:none;");

			curves[i].path = g.append("path")
			 .datum(data)
			 .attr("fill", "none")
			 .attr("stroke", "black")
			 .attr("d", line);
		}
		else {
			curves[i].noDataLabel.attr("style", null);
		}
	});
}