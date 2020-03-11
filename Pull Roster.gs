function onOpen() {
  var ui = SpreadsheetApp.getUi();

  ui.createMenu('Roster')
      .addItem('Populate Roster', 'populateRoster')
      .addItem('Populate Seating Chart' , 'seatingChart')
      .addToUi();
}

function populateRoster() {
  //Global Variables
  var FIRST_ROW = 5;

  //PreLoad Drive Structure so you can call the active sheet
  var dApp = DriveApp;

  var sApp = SpreadsheetApp;
  var ss = sApp.getActiveSpreadsheet();
  var rosterSheet = ss.getSheetByName("Roster")

  //Clear Data
  rosterSheet.getRange(FIRST_ROW, 1, rosterSheet.getLastRow()-1, rosterSheet.getLastColumn()).setValue("");

  //Pull Array from Aeries Data
  var aeriesRef = ss.getSheetByName("Data From Aeries");
  var referenceArray = aeriesRef.getRange(2, 1, aeriesRef.getLastRow()-1, aeriesRef.getLastColumn()).getValues();

  var colNum_block = 0;
  var colNum_id = 1;
  var colNum_fullName = 2;


  for(var si = 0; si < referenceArray.length; si++) {
    var block = referenceArray[si][colNum_block];
    var studentId = referenceArray[si][colNum_id];
    var fullName = referenceArray[si][colNum_fullName];

    var arrayByWord = fullName.split(", "); //Split by "comma space"
    var firstName = arrayByWord[1];
    var lastName = arrayByWord[0];

    var studentEmail = firstName.toLowerCase().trim() + "." + lastName.toLowerCase().trim() + "@sgv.csarts.net";

    var fourDigitId = studentId

    var shortId = studentId.toString().slice(-4);
    var lastNameInitial = "" + lastName.toString().slice(0, 1) + ".";

    //Put Data in Spreadsheet
    rosterSheet.getRange(FIRST_ROW + si, 1).setValue(block);
    rosterSheet.getRange(FIRST_ROW + si, 2).setValue(shortId.toString());
    rosterSheet.getRange(FIRST_ROW + si, 3).setValue(firstName);
    rosterSheet.getRange(FIRST_ROW + si, 4).setValue(lastName);
    rosterSheet.getRange(FIRST_ROW + si, 5).setValue(lastNameInitial);
    rosterSheet.getRange(FIRST_ROW + si, 6).setValue(studentEmail);
    rosterSheet.getRange(FIRST_ROW + si, 7).setValue(studentId);
  }
}

