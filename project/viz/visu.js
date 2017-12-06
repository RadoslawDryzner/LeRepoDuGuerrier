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
	$.get("getAllWords.php?genre=" + genre, function(data){
		curves[i].wordInput.typeahead('destroy')
		curves[i].wordInput.typeahead({source:data});
	},'json');
}

function updateTopicTypeahead(i, genre) {
	$.get("getAllTopics.php?genre=" + genre, function(data){
		curves[i].topicInput.typeahead('destroy')
		curves[i].topicInput.typeahead({source:data});
	},'json');
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
		fileName = "getWordData.php?genre=" + curves[i].genre + "&word=" + curves[i].word;
	}
	else if (curves[i].type === "topic") {
		fileName = "getTopicData.php?genre=" + curves[i].genre + "&topic=" + curves[i].topic;
	}
	else {
		fileName = "getSentimentData.php?genre=" + curves[i].genre;
	}

	d3.csv(fileName, data => {
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