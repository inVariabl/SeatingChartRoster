function test(){
  var x = 4;
  var y = 8;

  if (x == 4 && y == 8) {
    Logger.log("true")
  } else {
    Loggler.log("false")
  }
}


//function makeRequests(groups, presentationId, pageId) {
//  var requests;
//
//  var colNum_firstName = 2;
//  var colNum_lastInitial = 8;
//
//  var xCord_table1 = 7525512;
//  var yCord_table1 = 5367528;
//
//  var deltaX = 1115568;
//  var deltaY = 960120;
//
////  for (var gi = 0; gi < groups.length; gi++) {
//    for (var si = 0; si <groups[0].length; si++) {
//      var firstName = groups[0][si][colNum_firstName];
//      var lastInitial = groups[0][si][colNum_lastInitial];
//      var studentName = "" + firstName + " " + lastInitial + "";
//
//      var xCord;
//      var yCord;
//
//      if(si = 0) {
//        xCord = xCord_table1;
//        yCord = yCord_table1;
//      } else if(si = 1) {
//        xCord = xCord_table1 + deltaX;
//        yCord = yCord_table1;
//      } else if(si = 2) {
//        xCord = xCord_table1;
//        yCord = yCord_table1 + deltaY;
//      } else if(si = 3) {
//        xCord = xCord_table1 + deltaX;
//        yCord = yCord_table1 + deltaY;
//      }
//
//      requests.push([xCord, yCord]);
//    //  requests.push(returnRequest(studentName, xCord, yCord, presentationId, pageId));
//    //}
//  }
//
//  return requests;
//}
//
//
//function returnRequest(studentName, xCord, yCord, pageId) {
//  var elementId = gen_uuid();
//
//  var textbox_height = {
//    magnitude: 621792,
//    unit: 'EMU'
//  };
//
//  var textbox_width = {
//    magnitude: 1106424,
//    unit: 'EMU'
//  };
//
//  var textbox_fontSize = {
//    magnitude: 15,
//    unit: 'PT'
//  };
//
//  var textbox_style = {
//    fontSize: textbox_fontSize,
//    fontFamily: 'News Cycle',
//  };
//
//  var request = [
//  {
//    createShape: {
//      objectId: elementId,
//      shapeType: 'TEXT_BOX',
//      elementProperties: {
//        pageObjectId: pageId,
//        size: {
//          height: textbox_height,
//          width: textbox_width
//        },
//        transform: {
//          scaleX: 1,
//          scaleY: 1,
//          translateX: xCord,
//          translateY: yCord,
//          unit: 'EMU'
//        }
//      }
//    }
//  },
//
//  // Insert text into the box, using the supplied element ID.
//  {
//    insertText: {
//      objectId: elementId,
//      insertionIndex: 0,
//      text: studentName
//      },
//  },
//
//  {
//    updateTextStyle: {
//        objectId: elementId,
//        style: textbox_style,
//        textRange: {type: 'ALL'},
//        fields: 'fontSize,fontFamily'
//    }
//  },
//
//  {
//    updateParagraphStyle: {
//      objectId: elementId,
//      style: {alignment: 'CENTER'},
//      fields: 'alignment'
//    }
//  },
//
//  {
//    updateShapeProperties: {
//      objectId: elementId,
//      shapeProperties: {contentAlignment: 'MIDDLE'},
//      fields: 'contentAlignment'
//    }
//  }
//];
//
//  return request;
//}
//
//function sendToSeatingChart(requests, presentationId) {
//  // Execute the request.
//  var createTextboxWithTextResponse = Slides.Presentations.batchUpdate({
//    requests: requests
//  }, presentationId);
//  var createShapeResponse = createTextboxWithTextResponse.replies[0].createShape;
//  console.log('Created textbox with ID: %s', createShapeResponse.objectId);
//}

