//Database Config
var testgroup = [
  "big_duck",
  "medium_duck",
  "little_duck",
  "big_frog",
  "medium_frog",
  "little_frog",
  "big_bear",
  "medium_bear",
  "little_bear",
];
var db = [
    {
        name: "big_duck",
        big_duck: 0,
        medium_duck: 5,
        little_duck: 5,
        big_frog: 3,
        medium_frog: 0,
        little_frog: 0,
        big_bear: 3,
        medium_bear: 0,
        little_bear: 0
    }, {
        name: "medium_duck",
        big_duck: 5,
        medium_duck: 0,
        little_duck: 5,
        big_frog: 0,
        medium_frog: 3,
        little_frog: 0,
        big_bear: 0,
        medium_bear: 3,
        little_bear: 0
    }, {
        name: "little_duck",
        big_duck: 5,
        medium_duck: 5,
        little_duck: 0,
        big_frog: 0,
        medium_frog: 0,
        little_frog: 3,
        big_bear: 0,
        medium_bear: 0,
        little_bear: 3
    }, {
        name: "big_frog",
        big_duck: 3,
        medium_duck: 0,
        little_duck: 0,
        big_frog: 0,
        medium_frog: 5,
        little_frog: 5,
        big_bear: 3,
        medium_bear: 0,
        little_bear: 0
    }, {
        name: "medium_frog",
        big_duck: 0,
        medium_duck: 3,
        little_duck: 0,
        big_frog: 5,
        medium_frog: 0,
        little_frog: 5,
        big_bear: 0,
        medium_bear: 3,
        little_bear: 0
    }, {
        name: "little_frog",
        big_duck: 0,
        medium_duck: 0,
        little_duck: 3,
        big_frog: 5,
        medium_frog: 5,
        little_frog: 0,
        big_bear: 0,
        medium_bear: 0,
        little_bear: 3
    }, {
        name: "big_bear",
        big_duck: 3,
        medium_duck: 0,
        little_duck: 0,
        big_frog: 3,
        medium_frog: 0,
        little_frog: 0,
        big_bear: 0,
        medium_bear: 5,
        little_bear: 5
    }, {
        name: "medium_bear",
        big_duck: 0,
        medium_duck: 3,
        little_duck: 0,
        big_frog: 0,
        medium_frog: 3,
        little_frog: 0,
        big_bear: 5,
        medium_bear: 0,
        little_bear: 5
    }, {
        name: "little_bear",
        big_duck: 0,
        medium_duck: 0,
        little_duck: 3,
        big_frog: 0,
        medium_frog: 0,
        little_frog: 3,
        big_bear: 5,
        medium_bear: 5,
        little_bear: 0
    }
];
var myClass = db;

//Define Globals
var groupSize = 3;
var groupNum = 3;
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
    
    for(var i = 0; i < groupNum; i++) {
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
        println("**Group " + group + "**");
        for (var student = 0; student < groupSize; student++) {
            println(d2database[group][student].name);
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
        
        if(happiness > selectHappiness) {
            selectGroup = groups;
            selectHappiness = happiness;
        }
        loopCounter++;
    }
    
    //print outputs
    println("Happiness Index: " + selectHappiness);
    printOutput(selectGroup);
};

//Program Run
grouper(myClass, 100);

