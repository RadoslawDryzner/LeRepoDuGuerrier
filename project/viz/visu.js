const topics = [
	'other',
	'break-up',
	'friendship',
	'music',
	'nature',
	'feeling',
	'AA vernacular',
	'time',
	'love',
	'daily life',
	'life/death',
	'religion',
	'affection',
	'transport',
	'weather',
	'gangsta',
	'slang',
	'dance',
	'dream',
	'loneliness'
];

let curves = [];

const svg = d3.select("#viz-svg");

const margin = 40;
const canvasWidth = svg.node().getBoundingClientRect().width - 2 * margin;
const canvasHeight = svg.node().getBoundingClientRect().height - 2 * margin;

const g = svg.append("g")
			 .attr("transform", "translate(" + margin + "," + margin + ")");

const leftAxisG = g.append("g");

const bottomAxisG = g.append("g")
	 .attr("transform", "translate(0," + canvasHeight + ")")

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

let allGenres = [];
$.get("data4/allGenres.json", function(data){
	allGenres = data;
},'json');

const colors = ['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854'];

$("#btn-add").click(addCurve);

function addCurve() {
	let clone = $($("#curve-ui-template").clone()[0]);
	clone.attr("id", null);

	const color = colors[curves.length%colors.length];
	clone.attr("style", "background-color:" + color + ";");

	const genreInput = clone.find(".genre-typeahead");
	const wordInput = clone.find(".word-typeahead");
	const topicInput = clone.find(".topic-typeahead");

	const index = curves.length;

	genreInput.typeahead({source:allGenres});
	genreInput.change(function() {
		if (curves[index].genre == this.value) 
			return;

		curves[index].genre = this.value;

		if (curves[index].type === "word") {
			updateWordTypeahead(index, this.value);
		}

		updateCurve(index);
	});

	wordInput.change(function(){
		if (curves[index].type !== "word" || curves[index].word == this.value) 
			return;

		curves[index].word = this.value;
		updateCurve(index);
	});

	topicInput.typeahead({source:topics});
	topicInput.change(function(){
		if (curves[index].type !== "topic" || curves[index].topic == this.value) 
			return;

		curves[index].topic = this.value;
		updateCurve(index);
	});


	const removeButton = clone.find(".btn-remove");
	removeButton.click(() => {
		if (curves[index].path) {
			curves[index].path.remove();
			curves[index].path = null;
		}
		curves[index].max = 0;
		checkScales();
		clone.attr("style", "display:none;");
	});

	clone.find(".li-word").click(() => {changeCurveType(index, "word");});
	clone.find(".li-topic").click(() => {changeCurveType(index, "topic");});
	clone.find(".li-sentiment").click(() => {changeCurveType(index, "sentiment");});

	curves.push({
		type: "word",
		genre:"",
		word: "",
		topic: "",
		max: 0,
		color: color,
		dropdown: clone.find(".dropdown-text"),
		wordSpan: clone.find(".span-word"),
		wordInput: wordInput,
		topicSpan: clone.find(".span-topic"),
		topicInput: topicInput,
		noDataLabel: clone.find(".label-no-data")
	});

	clone.find(".span-topic").attr("style", "display:none;");
	topicInput.attr("style", "display:none;");

	$("#curves-ui").append(clone);
}

function updateWordTypeahead(i, genre) {
	curves[i].wordInput.typeahead('destroy')

	const filename = "data4/words/" + genre + "/allWords.json";
	checkFileExist(filename, () => {console.error("No word list for " + genre)}, () => {
		$.get(filename, data => {
			curves[i].wordInput.typeahead('destroy')
			curves[i].wordInput.typeahead({source:data});
		},'json');
	});
}

function changeCurveType(i, type) {
	curves[i].type = type;
	curves[i].dropdown.html(type.charAt(0).toUpperCase() + type.slice(1));

	if (type != "word") {
		curves[i].wordSpan.attr("style", "display:none;");
		curves[i].wordInput.attr("style", "display:none;");
	}
	else {
		updateWordTypeahead(i, curves[i].genre);

		curves[i].wordSpan.attr("style", null);
		curves[i].wordInput.attr("style", null);
	}

	if (type != "topic") {
		curves[i].topicSpan.attr("style", "display:none;");
		curves[i].topicInput.attr("style", "display:none;");
	}
	else {
		curves[i].topicSpan.attr("style", null);
		curves[i].topicInput.attr("style", null);
	}

	updateCurve(i);
}

function updateCurve(i) {
	let fileName;
	if (curves[i].type === "word") {
		fileName = "data4/words/" + curves[i].genre + "/" + curves[i].word + ".csv";
	}
	else if (curves[i].type === "topic") {
		fileName = "data4/topics/" + curves[i].genre + "/" + topics.indexOf(curves[i].topic) + ".csv";
	}
	else {
		fileName = "data4/sentiments/" + curves[i].genre + ".csv";
	}

	removePathIfAny(i);

	checkFileExist(fileName, () => {
		curves[i].noDataLabel.attr("style", null); //if file doesn't exist
		curves[i].max = 0;
		checkScales();
	}, () => {
		d3.csv(fileName) //if file exists
			.get(data => {
				curves[i].data = data;
				curves[i].max = Math.max(...data.map(d => d.value))
				curves[i].startYear = data[0].year;
				curves[i].endYear = data[data.length-1].year;

				createCurve(i);
				checkScales();
			});
	});
}

function removePathIfAny(i) {
	if (curves[i].path) { //removes the old curve
		curves[i].path.remove();
		curves[i].path = null;
	}
}

function createCurve(i) {
	curves[i].path = g.append("path")
	 .datum(curves[i].data)
	 .attr("fill", "none")
	 .attr("stroke", curves[i].color)
	 .attr("stroke-width", 7)
	 .attr("d", line)
	 .attr("class", "curve")
	 .on("mouseover", () => {
	 	curves[i].path.transition()
	 	 .duration(300)
	 	 .attr("stroke-width", 10)
	 })
	 .on("mouseout", () => {
	 	curves[i].path.transition()
	 	 .duration(300)
	 	 .attr("stroke-width", 7)
	 });

	let title = "";
	if (curves[i].type === "word") {
		title = curves[i].genre + " / " + curves[i].word;
	}
	else if (curves[i].type === "topic") {
		title = curves[i].genre + " / " + curves[i].topic;
	}
	else {
		title = curves[i].genre + " sentiments";
	}

    curves[i].path.append("svg:title")
      .text(title);

	curves[i].noDataLabel.attr("style", "display:none;");
}

function recreateAllCurves() {
	for (let i in curves) {
		if (curves[i].path) {
			removePathIfAny(i);
			createCurve(i);
		}
	}
}

function checkScales() {
	const currentMinX = scaleX.domain()[0];
	let newMinX = Math.min(...curves.filter(c => c.path).map(c => c.startYear));

	const currentMaxX = scaleX.domain()[1];
	let newMaxX = Math.max(...curves.filter(c => c.path).map(c => c.endYear));

	if (newMinX >= newMaxX) {
		newMinX = 1900;
		newMaxX = 2020;
	}

	const currentMaxY = scaleY.domain()[1];
	let newMaxY = Math.max(...curves.filter(c => c.path).map(c => c.max));

	if (newMaxY <= 0) {
		newMaxY = 1;
	}

	if (currentMinX !== newMinX || currentMaxX !== newMaxX || newMaxY !== currentMaxY) {
		recreateAllCurves();

		scaleX.domain([newMinX, newMaxX]);
		scaleY.domain([0, newMaxY]);

		bottomAxisG.transition()
            .duration(1000)
            .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")));

		leftAxisG.transition()
            .duration(1000)
            .call(d3.axisLeft(scaleY));

        d3.selectAll(".curve").transition()
        	.duration(1000)
        	.attr("d", line);

        return true;
	}

	return false;
}

function checkFileExist(filename, onError, onSuccess) {
	$.get("fileExist.php?file=" + filename, exists => {
		if(exists) {
			onSuccess();
		}
		else {
			onError();
		}
	}, 'json');
}

onResize();
$(window).resize(onResize);

function onResize() {
	const canvasWidth = svg.node().getBoundingClientRect().width - 2 * margin;
	const canvasHeight = svg.node().getBoundingClientRect().height - 2 * margin;

	scaleX.rangeRound([0, canvasWidth]);

	scaleY.rangeRound([canvasHeight, 0]);

	bottomAxisG
	 .attr("transform", "translate(0," + canvasHeight + ")")
	 .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")))
	 .attr("class", "bottom-axis");

	leftAxisG
	 .call(d3.axisLeft(scaleY))
	 .attr("class", "left-axis");

	recreateAllCurves();
}