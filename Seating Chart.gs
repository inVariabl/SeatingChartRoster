/* To Do
 * What to do about groups of 5?
 * Add Table Groups page for each block on batch output
 * Increase it so the Table Groups can handle 9 outputs
 * Maybe add an error checker to use before program runs (catches out of bounds (more than 9 tables, more than 4 per group))
 * Write program to generate seating chart page in response to data that will be mapped
 */

//roster is a 2d array ... roster[student][x]
//groups is a 3d array  ... groups[group][student][x]

//arrays are plural; items of arrays are singular
//eg groups[group]

//get prefix implies retrieval
//find prefix implies calculation
//put prefix implies outputting to spreadsheet
//make prefix implies creating a datastructure

function seatingChart() {
  //PreLoad Drive Structure so you can call the active sheet
  var dApp = DriveApp;

  //Loads input: roster & output: table groups
  var sApp = SpreadsheetApp;
  var activeSpreadsheet = sApp.getActiveSpreadsheet();
  var rosterSheet = activeSpreadsheet.getSheetByName("Roster");
  var seatingTableSheet = activeSpreadsheet.getSheetByName("Table Groups");

  //Loads output for visual seating cart in slides.
  var iApp = SlidesApp;

  //var studentViewPresentationId = rosterSheet.getRange('B2').getValue();
  //var studentViewPresentation = iApp.openById(studentViewPresentationId);
  //var studentViewCharts = studentViewPresentation.getSlides();

  var student = {
    PresentationId: rosterSheet.getRange('B2').getValue(),
    Presentation: iApp.openById(studentViewPresentationId),
    Charts: studentViewPresentation.getSlides(),
    Page: "",
    PageId: "",
  };

  var teacher = {
    PresentationId: rosterSheet.getRange('C2').getValue(),
    Presentation: iApp.openById(teacherViewPresentationId),
    Charts: teacherViewPresentation.getSlides(),
    Page: "",
    PageId: "",
  };

  //Define Roster variables
  //var firstRow = 5;
  //var firstCol = 1;
  //var numRows = rosterSheet.getLastRow() - firstRow + 1;
  //var colNum_rank = 8;

  var roster = {
    firstRow: 5,
    firstCol: 1,
    numRows: rosterSheet.getLastRow() - firstRow + 1,
    colNum_rank: 8,
  };

  //Group Variables
  var numGroups = rosterSheet.getRange('D2').getValue();
  var numOutputs = 1;

  var myRoster = rosterSheet.getRange(firstRow, firstCol, numRows, rosterSheet.getLastColumn()).getValues();
  var selectedBlock = rosterSheet.getRange('A2').getValue();

  if (selectedBlock == "all") {
    for(var i = 0; i < 6; i++) {
      var blockIndex = i + 1;
      student.Page = studentViewCharts[i];
      student.PageId = studentViewPage.getObjectId();

      teacher.Page = teacherViewCharts[i];
      teacher.PageId = teacherViewPage.getObjectId();

      grouper(blockIndex, myRoster, numGroups, colNum_rank, seatingTableSheet, studentViewPresentationId, teacherViewPresentationId, studentViewPageId, teacherViewPageId);
    }
  } else {
      student.Page = studentViewCharts[0];
      student.PageId = studentViewPage.getObjectId();

      teacher.Page = teacherViewCharts[0];
      var teacherViewPageId = teacherViewPage.getObjectId();

    grouper(selectedBlock, myRoster, numGroups, colNum_rank, seatingTableSheet, studentViewPresentationId, teacherViewPresentationId, studentViewPageId, teacherViewPageId);
  }
}

function grouper(selectedBlock, roster, numGroups, colNum_rank, seatingTableSheet, first_presentationId, second_presentationId, studentViewPageId, teacherViewPageId) {
  var selectedBlockRoster = pullBlockRoster(selectedBlock, roster);
  var targetRank = findTargetRank(selectedBlockRoster, numGroups, colNum_rank);

  //tests for null value in array.
  if(targetRank) {
    var groups = getHeterogeneousGroups(selectedBlockRoster, numGroups, targetRank, colNum_rank);
    shuffle(groups);

    var groupRanks = getRanks(groups);
    var groupDeviations = findDeviations(groupRanks, targetRank);

    var studentViewRequests = makeStudentViewRequests(groups, first_presentationId, studentViewPageId);
    createLabel(selectedBlock, first_presentationId, studentViewPageId);
    sendToSeatingChart(studentViewRequests, first_presentationId);

    var teacherViewRequests = makeTeacherViewRequests(groups, second_presentationId, teacherViewPageId);
    createLabel(selectedBlock, second_presentationId, teacherViewPageId);
    sendToSeatingChart(teacherViewRequests, second_presentationId);
  }
}

function createLabel(selectedBlock, presentationId, pageId) {
  var requests = [];

  var textbox_height = {
    magnitude: 667512,
    unit: 'EMU'
  };

  var textbox_width = {
    magnitude: 1655064,
    unit: 'EMU'
  };

  var textbox_fontSize = {
    magnitude: 24,
    unit: 'PT'
  };

  var textbox_style = {
    fontSize: textbox_fontSize,
    fontFamily: 'News Cycle',
  };

  var elementId = gen_uuid();
  var xCord = 374904;
  var yCord = 7278624;
  var rotation = inRadians(270);

  requests.push(createShapeRequest(elementId, pageId, textbox_height, textbox_width, xCord, yCord, rotation));
  requests.push(createTextRequest(elementId, "BLOCK " + (selectedBlock) + ""));
  requests.push(createFontRequest(elementId, textbox_style));

  var createTextboxWithTextResponse = Slides.Presentations.batchUpdate({
    requests: requests
  }, presentationId);
  var createShapeResponse = createTextboxWithTextResponse.replies[0].createShape;
  console.log('Created textbox with ID: %s', createShapeResponse.objectId);
}

//Output Groups to Seating Chart
function makeTeacherViewRequests(groups, presentationId, pageId) {
  var requests = [];

  var tableRowLength = 2;
  var seatWidth = 905256;
  var seatHeight = 621792;
  var seatHyp = Math.sqrt((seatWidth * seatWidth) + (seatHeight * seatHeight));
  var restingAngle = Math.atan(seatHeight/seatWidth);

  var roomRowLength = 3;
  var tableDX = 2816352;
  var tableDY = 2359152;
  var rotationsByColumn = [inRadians(330), inRadians(270), inRadians(30)];
  var tableRotation = 0;

  //define database references
  var colNum_firstName = 2;
  var colNum_lastInitial = 4;

  //define object properties
  var textbox_height = {
    magnitude: seatHeight,
    unit: 'EMU'
  };

  var textbox_width = {
    magnitude: seatWidth,
    unit: 'EMU'
  };

  var textbox_fontSize = {
    magnitude: 14,
    unit: 'PT'
  };

  var textbox_style = {
    fontSize: textbox_fontSize,
    fontFamily: 'News Cycle',
  };

  //cycle through groups then students
  for (var gi = 0; gi < groups.length; gi++) {

    var xCord_base = 8229600;
    var yCord_base = 6345936;
    var tableNum = gi + 1;
    var tableRotation = rotationsByColumn[tableNum%roomRowLength];

    yCord_base -= Math.floor((tableNum)/roomRowLength) * tableDY;
    xCord_base -= (tableNum)%roomRowLength * tableDX;

    for (var si = 0; si <groups[gi].length; si++) {

      var firstName = groups[gi][si][colNum_firstName];
      var lastInitial = groups[gi][si][colNum_lastInitial];
      var studentName = "" + firstName + " " + lastInitial + "";

      var xCord = xCord_base;
      var yCord = yCord_base;

      if (si%tableRowLength == 0 && Math.floor(si/tableRowLength) == 0) {
        xCord -= 0;
        yCord -= 0;
      } else if (si%tableRowLength == 1 && Math.floor(si/tableRowLength) == 0) {
        xCord += Math.sin(tableRotation) * seatHeight;
        yCord -= Math.cos(tableRotation) * seatHeight;
      } else if (si%tableRowLength == 0 && Math.floor(si/tableRowLength) == 1) {
        xCord -= Math.cos(tableRotation) * seatWidth;
        yCord -= Math.sin(tableRotation) * seatWidth;
      } else if (si%tableRowLength == 1 && Math.floor(si/tableRowLength) == 1) {
        xCord -= Math.cos(tableRotation + restingAngle) * seatHyp;
        yCord -= Math.sin(tableRotation + restingAngle) * seatHyp;
      }

      //generate requests and push them into array one at a time
      var elementId = gen_uuid();

      requests.push(createShapeRequest(elementId, pageId, textbox_height, textbox_width, xCord, yCord, tableRotation));
      requests.push(createTextRequest(elementId, studentName));
      requests.push(createFontRequest(elementId, textbox_style));
      requests.push(createAlignRequest(elementId));
      requests.push(createVertAlignRequest(elementId));
    }
  }
  return requests;
}



function makeStudentViewRequests(groups, presentationId, pageId) {
  var requests = [];

  var tableRowLength = 2;
  var seatWidth = 905256;
  var seatHeight = 621792;
  var seatHyp = Math.sqrt((seatWidth * seatWidth) + (seatHeight * seatHeight));
  var restingAngle = Math.atan(seatHeight/seatWidth);

  var roomRowLength = 3;
  var tableDX = 2816352;
  var tableDY = 2359152;
  var rotationsByColumn = [inRadians(330), inRadians(270), inRadians(30)];
  var tableRotation = 0;

  //define database references
  var colNum_firstName = 2;
  var colNum_lastInitial = 4;

  //define object properties
  var textbox_height = {
    magnitude: seatHeight,
    unit: 'EMU'
  };

  var textbox_width = {
    magnitude: seatWidth,
    unit: 'EMU'
  };

  var textbox_fontSize = {
    magnitude: 14,
    unit: 'PT'
  };

  var textbox_style = {
    fontSize: textbox_fontSize,
    fontFamily: 'News Cycle',
  };

  //cycle through groups then students
  for (var gi = 0; gi < groups.length; gi++) {

    var xCord_base = 2596896;
    var yCord_base = 1627632;
    var tableNum = gi + 1;
    var tableRotation = rotationsByColumn[tableNum%roomRowLength];

    yCord_base += Math.floor((tableNum)/roomRowLength) * tableDY;
    xCord_base += (tableNum)%roomRowLength * tableDX;

    for (var si = 0; si <groups[gi].length; si++) {

      var firstName = groups[gi][si][colNum_firstName];
      var lastInitial = groups[gi][si][colNum_lastInitial];
      var studentName = "" + firstName + " " + lastInitial + "";

      var xCord = xCord_base;
      var yCord = yCord_base;

      if (si%tableRowLength == 0 && Math.floor(si/tableRowLength) == 0) {
        xCord -= Math.cos(tableRotation + restingAngle) * seatHyp;
        yCord -= Math.sin(tableRotation + restingAngle) * seatHyp;
      } else if (si%tableRowLength == 1 && Math.floor(si/tableRowLength) == 0) {
        xCord -= Math.cos(tableRotation) * seatWidth;
        yCord -= Math.sin(tableRotation) * seatWidth;
      } else if (si%tableRowLength == 0 && Math.floor(si/tableRowLength) == 1) {
        xCord += Math.sin(tableRotation) * seatHeight;
        yCord -= Math.cos(tableRotation) * seatHeight;
      } else if (si%tableRowLength == 1 && Math.floor(si/tableRowLength) == 1) {
        xCord -= 0;
        yCord -= 0;
      }

      //generate requests and push them into array one at a time
      var elementId = gen_uuid();

      requests.push(createShapeRequest(elementId, pageId, textbox_height, textbox_width, xCord, yCord, tableRotation));
      requests.push(createTextRequest(elementId, studentName));
      requests.push(createFontRequest(elementId, textbox_style));
      requests.push(createAlignRequest(elementId));
      requests.push(createVertAlignRequest(elementId));
    }
  }
  return requests;
}

function inRadians(degrees) {
  return degrees * Math.PI / 180;
}

function gen_uuid() {
  return Utilities.getUuid();
}

function createShapeRequest(elementId, pageId, textbox_height, textbox_width, xCord, yCord, rotation) {
  if(!rotation) {
    rotation = 0;
  }

  var scaleX_val = Math.cos(rotation);
  var scaleY_val = Math.cos(rotation);
  var shearX_val = -Math.sin(rotation);
  var shearY_val = Math.sin(rotation);

  return {
    createShape: {
      objectId: elementId,
      shapeType: 'TEXT_BOX',
      elementProperties: {
        pageObjectId: pageId,
        size: {
          height: textbox_height,
          width: textbox_width
        },
        transform: {
          scaleX: scaleX_val,
          scaleY: scaleY_val,
          shearX: shearX_val,
          shearY: shearY_val,
          translateX: xCord,
          translateY: yCord,
          unit: 'EMU'
        }
      }
    }
  };
}

function createTextRequest(elementId, studentName) {
  return {
    insertText: {
      objectId: elementId,
      insertionIndex: 0,
      text: studentName
    }
  };
}

function createFontRequest(elementId, textbox_style){
  return {
    updateTextStyle: {
      objectId: elementId,
      style: textbox_style,
      textRange: {type: 'ALL'},
      fields: 'fontSize,fontFamily'
    }
  };
}

function createAlignRequest(elementId) {
  return{
    updateParagraphStyle: {
      objectId: elementId,
      style: {alignment: 'CENTER'},
      fields: 'alignment'
    }
  };
}

function createVertAlignRequest(elementId) {
  return {
    updateShapeProperties: {
      objectId: elementId,
      shapeProperties: {contentAlignment: 'MIDDLE'},
      fields: 'contentAlignment'
    }
  };
}


function sendToSeatingChart(requests, presentationId) {
  // Execute the request.
  var createTextboxWithTextResponse = Slides.Presentations.batchUpdate({
    requests: requests
  }, presentationId);
  var createShapeResponse = createTextboxWithTextResponse.replies[0].createShape;
  console.log('Created textbox with ID: %s', createShapeResponse.objectId);
}

function pullBlockRoster(block, roster) {
  var blockRoster = [];
  var colNum_block = 0;

  for(var si = 0; si < roster.length; si++) {
    var student = roster[si];

    if(student[colNum_block] == block) {
      blockRoster.push(roster[si]);
    }
  }

    return blockRoster;
}

function getHeterogeneousGroups(roster, numGroups, targetRank, colNum_rank) {
  var selectGroups = [];
  var groups;
  var groupRanks;
  var groupDeviations;
  var groupAbsValDeviations;
  var maxDeviation;

  var selectDeviation = Infinity;

  for (var i = 0; i < 1250; i++) {
    groups = pickGroups(roster, numGroups);
    groupRanks = getRanks(groups);
    groupDeviations = findDeviations(groupRanks, targetRank);
    groupAbsValDeviations = absValArray(groupDeviations);
    maxDeviation = maxArray(groupAbsValDeviations);

    if (maxDeviation < selectDeviation) {
      selectGroups = groups;
      selectDeviation = maxDeviation;
    }
  }

  return selectGroups;
}

//Output Groups to Spreadsheet
function flushTableGroupsOutputs(putSheet) {
  var putRow;
  var putColumn;

  for (var gi = 0; gi < 8; gi++) {
    if (gi < 4) {
      putColumn = 1;
      putRow = gi * 6 + 2;

    } else {
      putColumn = 5;
      putRow = (gi - 4) * 6 + 2;
    }

    putSheet.getRange(putRow - 1, putColumn + 2).setValue("");

    for (var si = 0; si < 5; si++) {
      putSheet.getRange(putRow, putColumn + 0).setValue("");
      putSheet.getRange(putRow, putColumn + 1).setValue("");
      putSheet.getRange(putRow, putColumn + 2).setValue("");

      putRow++;
    }
  }
}


function writeGroups(groups, groupDeviations, putSheet, targetRank) {
  var putRow;
  var putColumn;

  var colNum_Rank = 8;
  var colNum_firstName = 2;
  var colNum_lastName = 3;

  flushTableGroupsOutputs(putSheet);
  putSheet.getRange('I8').setValue(targetRank);


  for (var gi = 0; gi < groups.length; gi++) {
    if (gi < 4) {
      putColumn = 1;
      putRow = gi * 6 + 2;

    } else {
      putColumn = 5;
      putRow = (gi - 4) * 6 + 2;
    }

    putSheet.getRange(putRow - 1, putColumn + 2).setValue(groupDeviations[gi]);

    for (var si = 0; si < groups[gi].length; si++) {
      putSheet.getRange(putRow, putColumn + 0).setValue(groups[gi][si][colNum_Rank]);
      putSheet.getRange(putRow, putColumn + 1).setValue(groups[gi][si][colNum_firstName]);
      putSheet.getRange(putRow, putColumn + 2).setValue(groups[gi][si][colNum_lastName]);

      putRow++;
    }
  }
}

//Ranking Groups
function findDeviations(groupRanks, targetRank) {
  return groupRanks.map(function(rank) {
    return (rank - targetRank);
  });
}

function findTargetRank(roster, numGroups, colNum_Rank) {
  var targetRank = 0;
  var sumRanks = 0;

  for (var si = 0; si < roster.length; si++) {
    sumRanks += roster[si][colNum_Rank];
  }

  targetRank = sumRanks / roster.length;
  return targetRank;
}

function getIndividualRanks(groups) {
  var output = [];
  var studentRank;
  var colNum_rank = 8;
  var groupIndividualRanks = [];

  for (var gi = 0; gi < groups.length; gi++) {
    groupIndividualRanks[group]= [];

    for (var si = 0; si < groups[gi].length; si++) {
      studentRank = groups[gi][si][colNum_rank];
      groupIndividualRanks[gi].push(studentRank);
    }
  }

  return groupIndividualRanks;
}

function getHomogeneousGroups(roster, numGroups, targetRank, colNum_rank) {
  var selectGroups = [];
  var groupRanks;
  var groupIndividualRanks;
  var groupAbsValDeviations;
  var minDeviation;

  var selectDeviation = -Infinity;

  for (var i = 0; i < 1; i++) {
    groups = pickGroups(roster, numGroups);
    groupRanks = getRanks(groups);
    groupIndividualRanks = getIndividualRanks(groups);
  }


//
//    if (minDeviation > selectDeviation) {
//      output = groups;
//      selectDeviation = minDeviation;
//    }
//  }

  return groups;
}


function homogenousDeviations(groupRanks, groupIndividualRanks) {
  var groups;
  var groupRank;
  var individualRanks;

  for (var gi = 0; gi < groupRanks.length; gi++) {
    groupRank = groupRanks[gi];
    individualRanks = groupIndividualRanks[gi];


    for (var si = 0; si < groupRanks[gi].length; si++) {

    }
  }
}

function getRanks(groups) {
  var studentRank;
  var colNum_rank = 8;
  var groupRank;
  var groupRanks = [];

  for (var gi = 0; gi < groups.length; gi++) {
    groupRank = 0;

    for (var si = 0; si < groups[gi].length; si++) {
      studentRank = groups[gi][si][colNum_rank];
      groupRank = groupRank + studentRank;
    }

    groupRank = groupRank/groups[gi].length;

    groupRanks.push(groupRank);
  }

  return groupRanks;
}

//Picking Groups
function pickGroups(roster, numGroups) {
  shuffle(roster);

  var groups = [];

  for(var i = 0; i < numGroups; i++) {
    groups[i] = []; //Initialize an empty array for each group.
  }

  for (var si = 0; si < roster.length; si++) {
    var gi = si % numGroups;
    groups[gi].push(roster[si]);
  }

  return groups;
}

//Array Tools
function absValArray(array) {
  return array.map(function(value) {
    return Math.abs(value);
  });
}

function averageArray(array) {
  var arrayIndex = array.length;
  var sum = 0;
  var average;

  while (arrayIndex--) {
    sum += array[arrayIndex];
  }

  average = sum / array.length;
  return average;
}

function maxArray(array) {
  var arrayIndex = array.length;
  var max = -Infinity;

  while (arrayIndex--) {
    if (array[arrayIndex] > max) {
      max = array[arrayIndex];
    }
  }
  return max;
}

function minArray(array) {
  var arrayIndex = array.length;
  var min = Infinity;

  while (arrayIndex--) {
    if (array[arrayIndex] < min) {
      min = array[arrayIndex];
    }
  }
  return min;
}

function shuffle(array) {
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
}

