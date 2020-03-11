function isNewGroup(testGroup, groupList) {
  var output = true;
  var tester = testGroup.toString();
  var existingGroup;
  var existingTester;

//  Logger.log(testGroup);

  for (var i = 0; i< groupList.length; i++) {
    existingGroup = groupList[i];
    existingTester = existingGroup.toString();

    //this could be a weak point in the program.
    if (tester == existingTester) {
      output = false;
      return output;
    }
  }

  return output;
}

function orderGroups(groups) {
  var output = [];
  var groupA = [];
  var group1 = [];

  groupA = groups[0];
  group1 = groups[1];

  groupA = lowestToHighest(groupA);
  group1 = lowestToHighest(group1);

  output.push(groupA);
  output.push(group1);

  return output;
}

function lowestToHighest(group) {
  var output = []
  var student;

  while (group.length) {
    student = findLowest(group);
    output.push(group[student]);
    group.splice(student, 1);
    }

    return output;
}

function printOutput(d2database) {
    for (var group = 0; group < groupNum; group++) {
        println("**Group " + group + "**");
        for (var student = 0; student < groupSize; student++) {
            println(d2database[group][student].name);
        }
    }
}

function sumArray(array) {
  var output = 0;

  for (var i = 0; i < array.length; i++) {
    output = output + array[i];
  }

  return output;
}

function findSmaller(a, b) {
    if (b < a) {
        return b;
    } else {
        return a;
    }
}

function findLowest(array) {
  var lowestValue = array[0][0];
  var output = 0;

  for (var student = 0; student < array.length; student++) {
    if (array[student][0] < lowestValue) {
      lowestValue = array[student][0];
      output = student;
    }
  }

  return output;
}
