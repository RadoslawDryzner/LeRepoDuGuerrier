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

let allGenres = [];
$.get("data/allGenres.json", function(data){
	allGenres = data;
},'json');

$("#btn-add").click(addCurve);

function addCurve() {
	let clone = $($("#curve-ui-template").clone()[0]);
	clone.attr("id", null);
	clone.attr("style", null);

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
		else if (curves[index].type === "topic") {
			updateTopicTypeahead(index, this.value);
		}

		updateCurve(index);
	});
	wordInput.change(function(){
		if (curves[index].type !== "word" || curves[index].word == this.value) 
			return;

		curves[index].word = this.value;
		updateCurve(index);
	});
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
		checkYScale();
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

	const filename = "data/words/" + genre + "/allWords.json";
	checkFileExist(filename, () => {}, () => {
		$.get(filename, data => {
			curves[i].wordInput.typeahead({source:data});
		},'json');
	});
}

function updateTopicTypeahead(i, genre) {
	curves[i].topicInput.typeahead('destroy')

	const filename = "data/topics/" + genre + "/allTopics.json";
	checkFileExist(filename, () => {}, () => {
		$.get(filename, data => {
			curves[i].topicInput.typeahead({source:data});
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
		updateTopicTypeahead(i, curves[i].genre);

		curves[i].topicSpan.attr("style", null);
		curves[i].topicInput.attr("style", null);
	}

	updateCurve(i);
}

function updateCurve(i) {
	let fileName;
	if (curves[i].type === "word") {
		fileName = "data/words/" + curves[i].genre + "/" + curves[i].word + ".csv";
	}
	else if (curves[i].type === "topic") {
		fileName = "data/topics/" + curves[i].genre + "/" + curves[i].topic + ".csv";
	}
	else {
		fileName = "data/sentiments/" + curves[i].genre + ".csv";
	}

	removePathIfAny(i);

	checkFileExist(fileName, () => {
		curves[i].noDataLabel.attr("style", null); //if file doesn't exist
		curves[i].max = 0;
		checkYScale();
	}, () => {
		d3.csv(fileName) //if file exists
			.get(data => {
				curves[i].data = data;
				curves[i].max = Math.max(...data.map(d => d.value))

				createCurve(i);
				checkYScale();
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
	 .attr("stroke", "black")
	 .attr("d", line);

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

function checkYScale() {
	const currentMax = scaleY.domain()[1];
	let newMax = Math.max(...curves.map(c => c.max));

	if (newMax === 0) {
		newMax = 1;
	}

	if (newMax !== currentMax) {
		scaleY.domain([0, newMax]);

		d3.selectAll(".left-axis").remove();

		g.append("g")
		 .call(d3.axisLeft(scaleY))
		 .attr("class", "left-axis");

		recreateAllCurves();
	}

	return newMax !== currentMax;
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
	d3.selectAll(".bottom-axis").remove();
	d3.selectAll(".left-axis").remove();

	const canvasWidth = svg.node().getBoundingClientRect().width - 2 * margin;
	const canvasHeight = svg.node().getBoundingClientRect().height - 2 * margin;

	scaleX.rangeRound([0, canvasWidth]);

	scaleY.rangeRound([canvasHeight, 0]);

	g.append("g")
	 .attr("transform", "translate(0," + canvasHeight + ")")
	 .call(d3.axisBottom(scaleX).tickFormat(d3.format("d")))
	 .attr("class", "bottom-axis");

	g.append("g")
	 .call(d3.axisLeft(scaleY))
	 .attr("class", "left-axis");

	recreateAllCurves();
}