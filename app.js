
$(document).ready(function(){

// Initialize Firebase
  var config = {
    apiKey: "AIzaSyDicLDx7P9h6CmJZhaaBlVRFoV65KG7n7E",
    authDomain: "train-scheduler-239b1.firebaseapp.com",
    databaseURL: "https://train-scheduler-239b1.firebaseio.com/",
    storageBucket: "train-scheduler-239b1.appspot.com",
    messagingSenderId: "1021403544401"
  };
  //initial method to start firebase
  firebase.initializeApp(config);

//create database variable to reference database
var database = firebase.database();

//button to add new train 
$("#addtrain").on("click", function(){

//store user input into variables
	var newname = $("#name-input").val().trim();
	var newdestination = $("#destination-input").val().trim();
	var newfirsttraintime = moment($("#traintime-input").val().trim(), "hh:mm").format("hh:mm");
	var newfrequency = $("#frequency-input").val().trim();

//creating object to store each train input
	var newtrain = {
		name: newname,
		destination: newdestination,
		firsttraintime: newfirsttraintime,
		frequency: newfrequency
	};

//upload newtrain data to firebase
	database.ref().push(newtrain);

//clear all text boxes
	$("#name-input").val("");
	$("#destination-input").val("");
	$("#traintime-input").val("");
	$("#frequency-input").val("");

//prevent refreshing the page
    return false;

});

//creating an event listener to display new train data from firebase to html
database.ref().on("child_added", function(childSnapshot, prevChildKey){

	//store sorted firebase data into varibles
	var newname = childSnapshot.val().name;
	var newdestination = childSnapshot.val().destination;
	var newfirsttraintime = childSnapshot.val().firsttraintime;
	var newfrequency = childSnapshot.val().frequency;

	//new train data
	console.log(newname);
	console.log(newdestination);
	console.log(newfirsttraintime);
	console.log(newfrequency);

	//calculate the next arrival time and minutes away
		//first train time
		var firsttrain = moment(newfirsttraintime, "hh:mm").subtract(1,"years");
		//Difference between the current time and first train time
		var diffTime = moment().diff(moment(firsttrain), "minutes");
		//time in which the last train left
		var timetrainleft = diffTime % newfrequency
		//time in minutes until the next train arrives
		var minutesaway = newfrequency - timetrainleft
		//console log the time left until the next train
		console.log(minutesaway)
		//next train arrival
		var nextarrival= moment().add(minutesaway, "minutes");

		//add train data into the table
		// Add each train's data into the table
  		$("#trainschedule > tbody").append("<tr><td>" + newname + "</td><td>" + newdestination + "</td><td>" +
  		newfrequency + "</td><td>" + moment(nextarrival).format("HH:mm") + "</td><td>" + minutesaway + "</td></tr>");


});
});