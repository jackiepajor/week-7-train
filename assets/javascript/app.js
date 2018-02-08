//Initialize Firebase
var config = {
    apiKey: "AIzaSyDFTc7qF2RFl8tg3ahqVqt7g5zn7jVdV5g",
    authDomain: "train-scheduler-53893.firebaseapp.com",
    databaseURL: "https://train-scheduler-53893.firebaseio.com",
    projectId: "train-scheduler-53893",
    storageBucket: "train-scheduler-53893.appspot.com",
    messagingSenderId: "649224786555"
};
firebase.initializeApp(config);

//Create referene to Firebase
var database = firebase.database();

var currentTime = moment()

database.ref().on("child_added", function (childSnapshot) {

    var trainName = childSnapshot.val().trainName;
    var trainDestination = childSnapshot.val().trainDestination;
    var firstTrain = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().trainFrequency;
    var nextArrival = childSnapshot.val().nextArrival;
    var minutesAway = childSnapshot.val().minutesAway;

    //Take user inputs from the trainInputForm and append them to the 
    //appropriate columns in the train schedule panel
    $("#trains > tbody").append(
        "<tr><td>" + newTrain + "</tr><td>" 
        + newDestination + "</td><td>" + newFrequency + "</td><td>"
        + newNextArrial + "</td><td>" + newMinAway + "</td></tr>");
});

database.ref().on("value", function (snapshot) {

    });

//Retrieve input from users when submit button is clicked and send 
//info from the form to Firebase
$("#submit").on("click", function () {

    var newTrainName = $("#trainNameInput").val().trim();
    var newDestination = $("#destInput").val().trim();
    var newFirstTrain = $("#firstTrainInput").val().trim();
    var newFrequency = $("#freqInput").val().trim();


    //Confirm the user has entered an input for each of the 4 form values
    //If they left any blank, throw an alert message requesting input
    if (trainNameInput == "" || trainNameInput == null) {
        alert("Please enter a Train Name before submitting");
        return false;
    }

    if (destInput == "" || destInput == null) {
        alert("Please enter a Destination before submitting");
        return false;
    }

    if (firstTrainInput == "" || firstTrainInput == null) {
        alert("Please enter a Firt Train Time before submitting");
        return false;
    }

    if (freqInput == "" || freqInput == null) {
        alert("Please enter a Frequency before submitting");
        return false;
    }

    //Time calculations with MomentJS
    var firstTrainCalc = moment(newFirstTrain, "hh:mm").subtract("1, years");
    var timeDifference = currentTime.diff(moment(firstTrainCalc), "minutes");
    var timeRemaining = timeDifference % freqInput;
    var timeToNextTrain = freqInput - timeRemaining;
    var nextTrainTime = moment().add(timeToNextTrain, "minutes").format("hh:mm a");

    //Create array to store train information gathered from user input
    var newTrain = {
        trainName: trainNameInput,
        trainDestination: destInput,
        firstTrain: firstTrainInput,
        trainFrequency: freqInput,
        nextArrival: timeToNextTrain,
        minutesAway: nextTrainTime
    }

    //Push user inputs from form to Firebase
    database.ref().push(newTrain);

    $("#trainNameInput").val("");
    $("#destInput").val("");
    $("#firstTrainInput").val("");
    $("#freqInput").val("");


    return false;
});