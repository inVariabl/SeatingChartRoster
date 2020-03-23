'use strict';
// Load modules
const fs = require('fs');

// myClass = JSON Database (database.json)
let db = fs.readFileSync('database.json');
let myClass = JSON.parse(db);

// OutputArray
var OutputArray;

//Define Globals
const groupSize = 3;
const groupNum = 3;
//var allHappiness = [];

//Array Tools
var shuffle = function(array) {
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};
var findSmallest = function(a, b) {
  if (b < a) {
    return b;
  } else {
    return a;
  }
};

//Process Functions
var pickGroups = function(database) {
  var index = 0;
  shuffle(database);
  var output = [];

  for (var i = 0; i < groupNum; i++) {
    output.push([]);
  }

  for (var group = 0; group < groupNum; group++) {
    for (var student = 0; student < groupSize; student++) {
      output[group][student] = database[index];
      index++;
    }
  }
  return output;
};
var findHappiness = function(d2database) {
  var groupHappiness = 0;
  var rootStudentName;
  var testStudentObj;
  var allHappiness = [];

  for (var group = 0; group < groupNum; group++) {
    for (var rootStudent = 0; rootStudent < groupSize; rootStudent++) {
      rootStudentName = d2database[group][rootStudent].name;
      for (var testStudent = 0; testStudent < groupSize; testStudent++) {
        testStudentObj = d2database[group][testStudent];
        groupHappiness += testStudentObj[rootStudentName];
      }
    }
    allHappiness.push(groupHappiness);
    groupHappiness = 0;
  }

  return allHappiness.reduce(findSmallest);
};

var printOutput = function(d2database) {
  for (var group = 0; group < groupNum; group++) {
    console.log("**Group " + group + "**");
    console.log(d2database[0].name);
    for (var student = 0; student < groupSize; student++) {
      console.log(d2database[group][student].name);
    }
  }
};


//Master Program
var grouper = function(database, trials) {
  var selectHappiness = 0;
  var selectGroup = [];
  var groups;
  var happiness;
  var loopCounter = 0;

  for (var i = 0; i < trials; i++) {
    groups = pickGroups(database);
    happiness = findHappiness(groups);

    if (happiness > selectHappiness) {
      selectGroup = groups;
      selectHappiness = happiness;
    }
    loopCounter++;
  }

  //print outputs
  console.log("Happiness Index: " + selectHappiness);
  printOutput(selectGroup);
};

//Program Run
grouper(myClass, 100);
