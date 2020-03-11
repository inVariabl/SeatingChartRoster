//      style: {
//          fontFamily: 'Times New Roman',
//          fontSize: {
//              magnitude: 14,
//              unit: 'PT'
//          }
//      }


function batchData(myRoster, groupSize, groupNum, targetRank, colNum_rank, putSheet) {
  var groups;
  var groupRanks;
  var groupDeviations;
  var maxDeviation;

  var output = [];

  for (var i = 0; i < 10; i++) {
    groups = getHeterogeneousGroups(myRoster, groupSize, groupNum, targetRank, colNum_rank);
    groupRanks = getRanks(groups);
    groupDeviations = findDeviations(groupRanks, targetRank);
    maxDeviation = maxArray(groupDeviations);

    output.push(maxDeviation);
  }

  output = averageArray(output);
  putSheet.getRange(66, 2).setValue(output);

  Logger.log(output);
}

function Array_test() {
  var array = [1,2,3];

  array.push([4,5,6]);

  Logger.log(array);


}
