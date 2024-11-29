/*
Based on ChangeLog's code
8 Nov 12, Thursday (for Version 3)
- Added 50 colors, have sectors be randomized colors
- Fixed code to allow random sampling of the spinner values from a large dataset instead of a fixed one.
- Added "SpinnerID" to uniquly identify a spinner/win combination.
- Fixed "presentation Order" bug
- Added lots more "low-level" data (as opposed to keeping the winProbs, winChoice etc in data.trial)
  - e.g. added payoff1Array, payoff2Array, payoff3Array,
                prob1Array, prob2Array, prob3Array,
                winChoiceArray, winArray, winProbArray
- Populated new spinner dataset.
*/



/*
showSlide(id)
Displays each slide
*/

function showSlide(id) {
  $(".slide").hide();
  $("#"+id).show();
}

/* 
random(a,b)
Returns random number between a and b, inclusive
[Math.floor(Math.random()*(b-a+1)) + a] is to get range of random number
*/

function random(a,b) {
  if (typeof b == "undefined") {
    a = a || 2;
    return Math.floor(Math.random()*a);
  } else {
    return Math.floor(Math.random()*(b-a+1)) + a;
  }
}


/* 
Array.prototype.random
Randomly shuffles elements in an array. Useful for condition randomization.
*/

Array.prototype.random = function() {
  return this[random(this.length)];
}

/* 
Produces an array with numbers 0~arrLength
in random order. Kind of spurious--use 
Array.prototype.random instead
Fisher-Yates 
*/


function shuffledArray(arrLength)
{
  var j, tmp;
  var arr = new Array(arrLength);
  for (i = 0; i < arrLength; i++)
  {
    arr[i] = i;
  }
  for (i = 0; i < arrLength-1; i++)
  {
    j = Math.floor((Math.random() * (arrLength - 1 - i)) + 0.99) + i;
    tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

/* 
Gets the value of the checked radio button
*/

function getRadioCheckedValue(formNum, radio_name)
{
   var oRadio = document.forms[formNum].elements[radio_name];
   for(var i = 0; i < oRadio.length; i++)
   {
      if(oRadio[i].checked)
      {
         return oRadio[i].value;
      }
   }
   return '';
}

function setQuestion(array) {
    var i = random(0, array.length - 1);
    var q = array[i];
    return q;
}


/* 
Clears value from form
*/

function clearForm(oForm) {
    
  var elements = oForm.elements; 
    
  oForm.reset();

  for(i=0; i<elements.length; i++) {
      
	field_type = elements[i].type.toLowerCase();
	
	switch(field_type) {
	
		case "text": 
		case "password": 
		case "textarea":
	        case "hidden":	
			
			elements[i].value = ""; 
			break;
        
		case "radio":
		case "checkbox":
  			if (elements[i].checked) {
   				elements[i].checked = false; 
			}
			break;

		case "select-one":
		case "select-multi":
            		elements[i].selectedIndex = -1;
			break;

		default: 
			break;
	}
    }
}

 Raphael.fn.printWin = function(x, y, num) {
  return this.text(x, y, "Bob won $" + num, this.getFont("Myriad")).attr("font-size", "24");
  };


Raphael.fn.triangle = function(x, y, size) {
  var path = ["M", x, y];
  path = path.concat(["L", (x + size / 2), (y + size)]);
  path = path.concat(["L", (x - size / 2), (y + size)]);
  return this.path(path.concat(["z"]).join(" "));
};

Raphael.fn.pieChart = function (cx, cy, r, ProbValues, PayoffValues, colors, stroke) { 
  var paper = this,
  rad = Math.PI / 180,
  chart = this.set();
  

  function sector(cx, cy, r, startAngle, endAngle, params) {
    var x1 = cx + r * Math.cos(-startAngle * rad),
    x2 = cx + r * Math.cos(-endAngle * rad),
    y1 = cy + r * Math.sin(-startAngle * rad),
    y2 = cy + r * Math.sin(-endAngle * rad);
    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
  }
  function writeInSector(cx, cy, r, angle, PayoffValue, params) {
    return paper.text(cx + (r*0.6) * Math.cos(-angle * rad),
      cy + (r*0.6) * Math.sin(-angle * rad),
      "$" + PayoffValue, paper.getFont("Myriad")).attr("font-size", "24");
  }

  var angle = 0,
  total = 0,
  start = 0,
  chosenColors = [],
  process = function (j) {
    var value = ProbValues[j],
    angleplus = 360 * value / total,
    popangle = angle + (angleplus / 2),
    color_name = 0;
    ms = 500,
    delta = 30,
    bcolor = Raphael.hsb(start, 1, 1),
    // color="90-" + bcolor + "-" + Raphael.hsb(start, .75, 1);
      pickedColor = Math.floor(Math.random()*colors.length);
      for (var l = 0; l<j; l++) {
        while (pickedColor == chosenColors[l]) {
          pickedColor = Math.floor(Math.random()*colors.length);
        }
      }
      chosenColors[j] = pickedColor;
      color = colors[pickedColor].color;
    var p = sector(cx, cy, r, angle, angle + angleplus, {fill: color, stroke: stroke, "stroke-width": 10});
    p.start = angle;
    p.end =  angle + angleplus;
    var pFont = writeInSector(cx, cy, r, angle+angleplus/2, PayoffValues[j]);
    p.color_name =  color_name;
    p.val= Math.round(100*(value/total));
    angle += angleplus;

    chart.push(p);
    chart.push(pFont);
    

    start += .1;
  };
  for (var i = 0, ii = ProbValues.length; i < ii; i++) {
    total += ProbValues[i];
  }
  for (i = 0; i < ii; i++) {
    process(i);
  }
  return chart;
};





// Input Data for the wheel



var allConditions = [
[
{"condition":1, "Version":"3a", "SpinnerID":"1",  "probabilityVector":[.38, .36, .26],  "payoffVector":[0, 30, 60],   "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"2",  "probabilityVector":[.42, .31, .27],  "payoffVector":[0, 30, 60],   "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"3",  "probabilityVector":[.41, .37, .22],  "payoffVector":[0, 30, 60],   "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"4",  "probabilityVector":[.5, .31, .19],   "payoffVector":[10, 35, 75],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"5",  "probabilityVector":[.515, .3, .185], "payoffVector":[10, 35, 75],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"6",  "probabilityVector":[.5, .32, .18],   "payoffVector":[10, 35, 75],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"7",  "probabilityVector":[.47, .28, .25],  "payoffVector":[15, 70, 80],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"8",  "probabilityVector":[.49, .27, .24],  "payoffVector":[15, 70, 80],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"9",  "probabilityVector":[.45, .29, .26],  "payoffVector":[15, 70, 80],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"10", "probabilityVector":[.43, .39, .18],  "payoffVector":[20, 45, 70],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"11", "probabilityVector":[.41, .35, .24],  "payoffVector":[20, 45, 70],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"12", "probabilityVector":[.40, .34, .26],  "payoffVector":[20, 45, 70],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"13", "probabilityVector":[.31, .25, .44],  "payoffVector":[30, 50, 95],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"14", "probabilityVector":[.33, .29, .38],  "payoffVector":[30, 50, 95],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"15", "probabilityVector":[.30, .30, .40],  "payoffVector":[30, 50, 95],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"16", "probabilityVector":[.45, .37, .18],  "payoffVector":[25, 60, 100], "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"17", "probabilityVector":[.42, .38, .20],  "payoffVector":[25, 60, 100], "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"18", "probabilityVector":[.43, .35, .22],  "payoffVector":[25, 60, 100], "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"19", "probabilityVector":[.31, .32, .37],  "payoffVector":[25, 45, 80],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"20", "probabilityVector":[.26, .32, .42],  "payoffVector":[25, 45, 80],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"21", "probabilityVector":[.30, .30, .40],  "payoffVector":[25, 45, 80],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"22", "probabilityVector":[.32, .16, .52],  "payoffVector":[20, 60, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"23", "probabilityVector":[.34, .22, .44],  "payoffVector":[20, 60, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"24", "probabilityVector":[.33, .20, .47],  "payoffVector":[20, 60, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"25", "probabilityVector":[.21, .36, .43],  "payoffVector":[15, 50, 75],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"26", "probabilityVector":[.24, .40, .36],  "payoffVector":[15, 50, 75],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"27", "probabilityVector":[.25, .38, .37],  "payoffVector":[15, 50, 75],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"28", "probabilityVector":[.36, .40, .24],  "payoffVector":[40, 65, 100], "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"29", "probabilityVector":[.38, .34, .28],  "payoffVector":[40, 65, 100], "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"30", "probabilityVector":[.37, .32, .31],  "payoffVector":[40, 65, 100], "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"31", "probabilityVector":[.54, .30, .16],  "payoffVector":[45, 60, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"32", "probabilityVector":[.52, .29, .19],  "payoffVector":[45, 60, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"33", "probabilityVector":[.50, .30, .20],  "payoffVector":[45, 60, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"34", "probabilityVector":[.43, .23, .34],  "payoffVector":[30, 50, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"35", "probabilityVector":[.41, .24, .35],  "payoffVector":[30, 50, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"36", "probabilityVector":[.39, .25, .36],  "payoffVector":[30, 50, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"37", "probabilityVector":[.28, .19, .53],  "payoffVector":[20, 50, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"38", "probabilityVector":[.30, .18, .52],  "payoffVector":[20, 50, 90],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"39", "probabilityVector":[.32, .18, .50],  "payoffVector":[20, 50, 90],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"40", "probabilityVector":[.27, .38, .35],  "payoffVector":[0, 40, 95],   "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"41", "probabilityVector":[.27, .40, .33],  "payoffVector":[0, 40, 95],   "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"42", "probabilityVector":[.26, .42, .32],  "payoffVector":[0, 40, 95],   "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"43", "probabilityVector":[.55, .28, .17],  "payoffVector":[10, 50, 75],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"44", "probabilityVector":[.58, .24, .18],  "payoffVector":[10, 50, 75],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"45", "probabilityVector":[.60, .24, .16],  "payoffVector":[10, 50, 75],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"46", "probabilityVector":[.26, .53, .21],  "payoffVector":[55, 70, 85],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"47", "probabilityVector":[.28, .51, .21],  "payoffVector":[55, 70, 85],  "winChoice":2},
{"condition":1, "Version":"3a", "SpinnerID":"48", "probabilityVector":[.25, .52, .23],  "payoffVector":[55, 70, 85],  "winChoice":3},
{"condition":1, "Version":"3a", "SpinnerID":"49", "probabilityVector":[.30, .52, .18],  "payoffVector":[50, 75, 90],  "winChoice":1},
{"condition":1, "Version":"3a", "SpinnerID":"50", "probabilityVector":[.32, .50, .18],  "payoffVector":[50, 75, 90],  "winChoice":2}
],
[
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
{"condition":2, "probabilityVector":[.1, .2, .7], "payoffVector":[10, 8, 3], "winChoice":2},
]
];

var RelationshipPair = ["1F","1M","2F","2M","3F","3M","4F","4M","5F","5M"];

/* Experimental Variables */
// Number of conditions in experiment
var numConditions = 1; //allConditions.length;

// Randomly select a condition number for this particular participant
var chooseCondition = 1; // random(0, numConditions-1);

// Based on condition number, choose set of input (trials)
var allTrialOrders = allConditions[chooseCondition-1];

// Number of trials in each condition
var numTrials = 10; //not necessarily allTrialOrders.length;

// Produce random order in which the trials will occur
var shuffledOrder = shuffledArray(allTrialOrders.length);

// Produce random order in which relationship pair will occur
var shuffledPair = shuffledArray(RelationshipPair.length);


// Keep track of current trial 
var currentTrialNum = 0;

// A variable special for this experiment because we're randomly
// choosing word orders as well
// var wordOrder = 100;
var trial;

// Keep track of how many trials have been completed
var numComplete = 0;


var colors = [{color_name:"AliceBlue",color:"#F0F8FF"}, 
            {color_name:"AntiqueWhite",color:"#FAEBD7"},
            {color_name:"Aqua",color:"#00FFFF"},
            {color_name:"Aquamarine",color:"#7FFFD4"},
            {color_name:"Bisque",color:"#FFE4C4"},
            {color_name:"Chocolate",color:"#D2691E"},
            {color_name:"CornflowerBlue",color:"#6495ED"},
            {color_name:"Crimson",color:"#DC143C"},
            {color_name:"DarkCyan",color:"#008B8B"},
            {color_name:"DarkGoldenRod",color:"#B8860B"},
            {color_name:"DarkKhaki",color:"#BDB76B"},
            {color_name:"DarkOliveGreen",color:"#556B2F"},
            {color_name:"DarkOrange",color:"#FF8C00"},
            {color_name:"DarkSalmon",color:"#E9967A"},
            {color_name:"DeepPink",color:"#FF1493"},
            {color_name:"DeepSkyBlue",color:"#00BFFF"},
            {color_name:"DodgerBlue",color:"#1E90FF"},
            {color_name:"ForestGreen",color:"#228B22"},
            {color_name:"Gold",color:"#FFD700"},
            {color_name:"GoldenRod",color:"#DAA520"},
            {color_name:"Gray",color:"#808080"},
            {color_name:"Green",color:"#008000"},
            {color_name:"IndianRed",color:"#CD5C5C"},
            {color_name:"Khaki",color:"#F0E68C"},
            {color_name:"Lavender",color:"#E6E6FA"},
            {color_name:"LemonChiffon",color:"#FFFACD"},
            {color_name:"LightBlue",color:"#ADD8E6"},
            {color_name:"LightCoral",color:"#F08080"},
            {color_name:"LightCyan",color:"#E0FFFF"},
            {color_name:"LightGray",color:"#D3D3D3"},
            {color_name:"MistyRose",color:"#FFE4E1"},
            {color_name:"Orange",color:"#FFA500"},
            {color_name:"OrangeRed",color:"#FF4500"},
            {color_name:"PaleGoldenRod",color:"#EEE8AA"},
            {color_name:"PaleGreen",color:"#98FB98"},
            {color_name:"PaleTurquoise",color:"#AFEEEE"},
            {color_name:"PaleVioletRed",color:"#DB7093"},
            {color_name:"PeachPuff",color:"#FFDAB9"},
            {color_name:"Peru",color:"#CD853F"},
            {color_name:"Pink",color:"#FFC0CB"},
            {color_name:"Plum",color:"#DDA0DD"},
            {color_name:"PowderBlue",color:"#B0E0E6"},
            {color_name:"SeaGreen",color:"#2E8B56"},
            {color_name:"Sienna",color:"#A0522D"},
            {color_name:"Silver",color:"#C0C0C0"},
            {color_name:"SteelBlue",color:"#4682B4"},
            {color_name:"Tan",color:"#D2B48C"},
            {color_name:"Tomato",color:"#FF6347"},
            {color_name:"Turquoise",color:"#40E0D0"},
            {color_name:"YellowGreen",color:"#9ACD32"}
            ];


/*
Show the instructions slide — this is what we want subjects to see first.
*/

$("#progressBar").hide();
showSlide("instructions");


// Updates the progress bar
$("#trial-num").html(numComplete);
$("#total-num").html(numTrials);

/*
The actual variable that will be returned to MTurk. The experiment object with various variables that you want to keep track of and return as results.

More practically, you should stick everything in an object and submit that whole object so that you don’t lose data (e.g. randomization parameters, what condition the subject is in, etc). Don’t worry about the fact that some of the object properties are functions — mmturkey (the Turk submission library) will strip these out.
*/

var experiment = {

/*
Parameters for this sequence.
*/
  condition: 1,

  // An array of subjects' responses to each trial (NOTE: in the order in which
  // you initially listed the trials, not in the order in which they appeared)
  //results: new Array(numTrials),

  // The order in which each trial appeared
  //orders: new Array(numTrials),

  // The order in which each trial is presented. i.e. 
  // presentationOrder[i] = j means the i-th trial is the j-th one in the trial sequence.
  // Note that presentationOrder is now obsolete with spinnerIDArray
  // presentationOrder: new Array(numTrials),

  spinnerIDArray: new Array(numTrials),
  payoff1Array: new Array(numTrials),
  payoff2Array: new Array(numTrials),
  payoff3Array: new Array(numTrials),
  prob1Array: new Array(numTrials),
  prob2Array: new Array(numTrials),
  prob3Array: new Array(numTrials),
  winChoiceArray: new Array(numTrials),
  winArray: new Array(numTrials),
  winProbArray: new Array(numTrials),
  
  // My Results:
  QHappyResponseArray: new Array(numTrials),
  QSadResponseArray: new Array(numTrials),
  QAngerResponseArray: new Array(numTrials),
  QSurpriseResponseArray: new Array(numTrials),
 
  QClosenessResponseArray: new Array(numTrials),

  QHappyInferResponseArray: new Array(numTrials),
  QSadInferResponseArray: new Array(numTrials),
  QAngerInferResponseArray: new Array(numTrials),
  QSurpriseInferResponseArray: new Array(numTrials),

  qVresponseArray: new Array(numTrials),
  qAresponseArray: new Array(numTrials),

  q1freeResponse: [],
  q2freeResponse: [],
  q3freeResponse: [],
  q4freeResponse: [],

  
  angleProportionArray: new Array(numTrials),

  // Demographics
  //gender: "",
  //age:"",
  //nativeLanguage:"",
  comments:"",

 //trials: myTrialOrder,

/*
An array to store the data that we’re collecting.
*/

  data: [],

// Goes to description slide
  description: function() {
    $("#progressBar").show();
    showSlide("description");
    $("#tot-num").html(numTrials);

    
  },

/*
The function that gets called when the sequence is finished.
*/

  end: function() {
  	// Records demographics
    //var gen = $('input[name="genderButton"]:checked').val();
    //var ag = document.age.ageRange.value;
    //var lan = document.language.nativeLanguage.value;
    var comm = document.comments.input.value;
    //experiment.gender = gen;
    //experiment.age = ag;
    //experiment.nativeLanguage = lan;
    experiment.comments = comm;
    //clearForm(document.forms[1]);
    //clearForm(document.forms[2]);
    //clearForm(document.forms[3]);
    //clearForm(document.forms[4]);

    // Show the finish slide.
    showSlide("finished");

    /*
    Wait 1.5 seconds and then submit the whole experiment object to Mechanical Turk (mmturkey filters out the functions so we know we’re just submitting properties [i.e. data])
    */
    setTimeout(function() { turk.submit(experiment);}, 1500);
  },





  next: function() {

  //var n = experiment.trials.shift();
  // if (typeof n == "undefined") {
  //      return experiment.end();
  //    }
        var CharNameListMale = ["Alex", "Bob", "Charlie", "Chris", 
        "David", "Eric", "Frank", "George", "Jacob", "Jake", 
        "James", "John", "Josh", "Mike", "Scott", "Steve", "Tom"];

        function refreshCharNameMale() {
            return(CharNameListMale[Math.floor(Math.random()*17)]);
        };
        var CharNameMale = refreshCharNameMale();  

        var CharNameListFemale = ["Emma", "Ava", "Olivia", "Mia", 
          "Zoe", "Lily", "Ella", "Anna", "Kate", "Nora", 
          "Evelyn", "Amy", "Rose", "Sarah", "Jane", "Chloe", "Grace"];
  
        function refreshCharNameFemale() {
            return(CharNameListFemale[Math.floor(Math.random()*17)]);
        };
        var CharNameFemale = refreshCharNameFemale();    

  
      

        

    
    var winningAngle;
    var probabilityVectorTotal;
    var angleStart;
    var angleEnd;
    var randProportion;
    var bobStickFigure, hand, spinner, goButton, goButtonLabel;





  showSlide("stage");
  $("#response").hide();
  
  if (numComplete == 0) { // First trial: create canvas.
      canvas=Raphael('wheel');

      currentPair = shuffledPair[numComplete];
      currentLabel = RelationshipPair[currentPair];
      $('#currentLabel').html(currentLabel);


    // Prepare materials for instruction in html
    if(currentLabel.includes("1F")){
      // Change image if currentLabel contains "1F"
      ImageSrc = "images/relationship_1F.png";
      RelationText = CharNameFemale + " and " + CharNameMale + " are siblings who still live in the same city as adults. <br>They are very close and care about each other a lot.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);
      

    } else if (currentLabel.includes("1M")) {
      ImageSrc = "images/relationship_1M.png";
      RelationText = CharNameMale + " and " + CharNameFemale + " are siblings who still live in the same city as adults. <br>They are very close and care about each other a lot.";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("2F")) {
      ImageSrc = "images/relationship_2F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are friends. <br>They regularly talk to each other about what is going on in their lives and do things together with other friends.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("2M")) {
      ImageSrc = "images/relationship_2M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are friends. <br>They regularly talk to each other about what is going on in their lives and do things together with other friends.";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("3F")) {
      ImageSrc = "images/relationship_3F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are coworkers who have finished several projects together. <br>They like and respect one another, though they are not friends outside of work.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("3M")) { 
      ImageSrc = "images/relationship_3M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are coworkers who have finished several projects together. <br>They like and respect one another, though they are not friends outside of work.";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("4F")) {
      ImageSrc = "images/relationship_4F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are strangers who live in the same city but have never met. <br>They have no particular concern for one another.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("4M")) {
      ImageSrc = "images/relationship_4M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are strangers who live in the same city but have never met. <br>They have no particular concern for one another. ";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("5F")) {
      ImageSrc = "images/relationship_5F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are neighbors. <br>They dislike each other because they believe the other to be nosy and careless.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("5M")) { 
      ImageSrc = "images/relationship_5M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are neighbors. <br>They dislike each other because they believe the other to be nosy and careless. ";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Clfick the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);
    }

    // Use jQuery to update the src of the image dynamically
    $('#relationPic').attr('src', ImageSrc);  // Select the <img> element and change its src attribute
    $('#relationText').html(RelationText);
    $('#quesText1').html(QuesText1);
    $('#quesText2').html(QuesText2);
    $('#quesText3').html(QuesText3);
    $('#responseText2').html(ResponseText2);
    $('#responseText3').html(ResponseText3);

    
  }

  // If this is not the first trial, record variables
  if (numComplete > 0 && numComplete < 10 ) {
    canvas.clear();

    window.scrollTo(0, 0); // scroll to the top of the page

    currentPair = shuffledPair[numComplete];
    currentLabel = RelationshipPair[currentPair];
    $('#currentLabel').html(currentLabel);

    // Prepare materials for instruction in html
    if(currentLabel.includes("1F")){
      // Change image if currentLabel contains "1F"
      ImageSrc = "images/relationship_1F.png";
      RelationText = CharNameFemale + " and " + CharNameMale + " are siblings who still live in the same city as adults. <br>They are very close and care about each other a lot.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);
      

    } else if (currentLabel.includes("1M")) {
      ImageSrc = "images/relationship_1M.png";
      RelationText = CharNameMale + " and " + CharNameFemale + " are siblings who still live in the same city as adults. <br>They are very close and care about each other a lot.";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("2F")) {
      ImageSrc = "images/relationship_2F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are friends. <br>They regularly talk to each other about what is going on in their lives and do things together with other friends.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("2M")) {
      ImageSrc = "images/relationship_2M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are friends. <br>They regularly talk to each other about what is going on in their lives and do things together with other friends.";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("3F")) {
      ImageSrc = "images/relationship_3F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are coworkers who have finished several projects together. <br>They like and respect one another, though they are not friends outside of work.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("3M")) { 
      ImageSrc = "images/relationship_3M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are coworkers who have finished several projects together. <br>They like and respect one another, though they are not friends outside of work.";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer)."
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("4F")) {
      ImageSrc = "images/relationship_4F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are strangers who live in the same city but have never met. <br>They have no particular concern for one another.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("4M")) {
      ImageSrc = "images/relationship_4M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are strangers who live in the same city but have never met. <br>They have no particular concern for one another. ";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);

    } else if (currentLabel.includes("5F")) {
      ImageSrc = "images/relationship_5F.png";
      RelationText = CharNameFemale+ " and "+ CharNameMale+ " are neighbors. <br>They dislike each other because they believe the other to be nosy and careless.";
      
      QuesText1 = CharNameFemale+ " is going to spin this wheel."
      QuesText2 = "She will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think she feels?";
      ResponseText3 = "Please guess how strongly she feels for each of the following emotions:";

      pronoun_rater = 'he';

      $('#CharName').html(CharNameFemale);
      $('#CharName2').html(CharNameFemale);
      $('#CharName3').html(CharNameFemale);
      $('#CharName4').html(CharNameFemale);
      $('#CharName_rater').html(CharNameMale);
      $('#CharName_rater2').html(CharNameMale);
      $('#CharName_rater3').html(CharNameMale);
      $('#pronoun_rater').html(pronoun_rater);


    } else if (currentLabel.includes("5M")) { 
      ImageSrc = "images/relationship_5M.png";
      RelationText = CharNameMale+ " and "+ CharNameFemale+ " are neighbors. <br>They dislike each other because they believe the other to be nosy and careless. ";
      
      QuesText1 = CharNameMale+ " is going to spin this wheel."
      QuesText2 = "He will win the amount of money shown in the section the wheel lands on (indicated by the black pointer). "
      QuesText3 = "Click the 'Go' button when you're ready, and then scroll down."

      ResponseText2 = "How do you think he feels?";
      ResponseText3 = "Please guess how strongly he feels for each of the following emotions:";

      pronoun_rater = 'she';

      $('#CharName').html(CharNameMale);
      $('#CharName2').html(CharNameMale);
      $('#CharName3').html(CharNameMale);
      $('#CharName4').html(CharNameMale);
      $('#CharName_rater').html(CharNameFemale);
      $('#CharName_rater2').html(CharNameFemale);
      $('#CharName_rater3').html(CharNameFemale);
      $('#pronoun_rater').html(pronoun_rater);
    }

    // Use jQuery to update the src of the image dynamically
    $('#relationPic').attr('src', ImageSrc);  // Select the <img> element and change its src attribute
    $('#relationText').html(RelationText);
    $('#quesText1').html(QuesText1);
    $('#quesText2').html(QuesText2);
    $('#quesText3').html(QuesText3);
    $('#responseText2').html(ResponseText2);
    $('#responseText3').html(ResponseText3);
  
  
    
  
            //var rating = parseFloat(document.rating.score.value);
            //experiment.results[currentTrialNum] = rating;
            //experiment.orders[currentTrialNum] = numComplete;
            //experiment.wordOrders[currentTrialNum] = wordOrder;
            
            //experiment.isPuns[currentTrialNum] = trial.isPun;
            //experiment.isCorrects[currentTrialNum] = trial.isCorrect;

            //experiment.presentationOrder[numComplete-1] = currentTrialNum;

            experiment.QHappyResponseArray[numComplete-1] = $('input[name="QHappy"]:checked').val();
            experiment.QSadResponseArray[numComplete-1] = $('input[name="QSad"]:checked').val();
            experiment.QAngerResponseArray[numComplete-1] = $('input[name="QAnger"]:checked').val();
            experiment.QSurpriseResponseArray[numComplete-1] = $('input[name="QSurprise"]:checked').val();

            experiment.QClosenessResponseArray[numComplete-1] = $('input[name="QCloseness"]:checked').val();

            experiment.QHappyInferResponseArray[numComplete-1] = $('input[name="QHappyInfer"]:checked').val();
            experiment.QSadInferResponseArray[numComplete-1] = $('input[name="QSadInfer"]:checked').val();
            experiment.QAngerInferResponseArray[numComplete-1] = $('input[name="QAngerInfer"]:checked').val();
            experiment.QSurpriseInferResponseArray[numComplete-1] = $('input[name="QSurpriseInfer"]:checked').val();

            //var q1response = $('input[name="q1"]:checked').val();

            /*
            trial.q1response = $('input[name="q1"]:checked').val();
            trial.q2response = $('input[name="q2"]:checked').val();
            trial.q3response = $('input[name="q3"]:checked').val();
            trial.q4response = $('input[name="q4"]:checked').val();
            trial.q5response = $('input[name="q5"]:checked').val();
            trial.q6response = $('input[name="q6"]:checked').val();
            trial.q7response = $('input[name="q7"]:checked').val();
            trial.q8response = $('input[name="q8"]:checked').val();
            
            */

            
            
            experiment.data.push(trial);
            

            $('input[name="QHappy"]:').prop('checked', false);
            $('input[name="QSad"]:').prop('checked', false);
            $('input[name="QAnger"]:').prop('checked', false);
            $('input[name="QSurprise"]:').prop('checked', false);

            $('input[name="QCloseness"]:').prop('checked', false);
            

            $('input[name="QHappyInfer"]:').prop('checked', false);
            $('input[name="QSadInfer"]:').prop('checked', false);
            $('input[name="QAngerInfer"]:').prop('checked', false);
            $('input[name="QSurpriseInfer"]:').prop('checked', false);



            //clearForm(document.forms[0]);
          }


  // If subject has completed all trials, update progress bar and
  // show slide to ask for demographic info
  if (numComplete >= numTrials) {
          $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
          $("#trial-num").html(numComplete);
          $("#total-num").html(numTrials);
          showSlide("askInfo");
        // Otherwise, if trials not completed yet, update progress bar
        // and go to next trial based on the order in which trials are supposed
        // to occur
      } else {
        $('.bar').css('width', (200.0 * numComplete/numTrials) + 'px');
        $("#trial-num").html(numComplete);
        $("#total-num").html(numTrials);


        //currentTrialNum is used for randomizing later
        currentTrialNum = shuffledOrder[numComplete]; //numComplete //allTrialOrders[numComplete];
        trial = allTrialOrders[currentTrialNum];

        probabilityVector = trial.probabilityVector;
        payoffVector = trial.payoffVector;
        winChoice = trial.winChoice;
        
        // winningAngle = 3000;

        // simple routine to calculate win angle.
        // normalizing 
        probabilityVectorTotal=0;
        angleStart = 0;
        for (var i = 0; i < probabilityVector.length; i++) {
          probabilityVectorTotal += probabilityVector[i];
          if (i<winChoice-1) {
            angleStart += probabilityVector[i];
          };
        };
        for (var i = 0; i < probabilityVector.length; i++) {
          probabilityVector[i] = probabilityVector[i] / probabilityVectorTotal;
        }
        angleStart = angleStart / probabilityVectorTotal;
        angleEnd = angleStart + probabilityVector[winChoice-1];
        // now the desired winning angle is between [angleStart, angleEnd] * 360 degrees
        randProportion = Math.random();
        // calculate winning angle = uniform draw from [angleStart, angleEnd] * 360 degrees
        // plus 5-10 rounds. Remember to offset - 90 degrees because the angles are calculated
        // from the positive x axis while the pointer is along the positive y axis.
        winningAngle = ((angleStart * (1-randProportion) + angleEnd * randProportion) 
        + 5 + Math.floor(Math.random()*5)) * 360 - 90;
        //randProportion = 1;
        //winningAngle = ((angleStart * (1-randProportion) + angleEnd * randProportion) * 360)- 90; 
            // 0 is nearer the outcome before it, 1 is nearer the outcome after it
        
        //probabilityVector = [.1, .3, .6];
        //payoffVector = [10, 5, 2];
            

            experiment.spinnerIDArray[numComplete] = trial.SpinnerID;
            experiment.payoff1Array[numComplete] = payoffVector[0] ;
            experiment.payoff2Array[numComplete] = payoffVector[1] ;
            experiment.payoff3Array[numComplete] = payoffVector[2] ;
            experiment.prob1Array[numComplete] = probabilityVector[0] ;
            experiment.prob2Array[numComplete] = probabilityVector[1] ;
            experiment.prob3Array[numComplete] = probabilityVector[2] ;
            experiment.angleProportionArray[numComplete] = Math.round(randProportion*1000)/1000;
            experiment.winChoiceArray[numComplete] = winChoice;
            experiment.winArray[numComplete] = payoffVector[winChoice-1];
            experiment.winProbArray[numComplete] = probabilityVector[winChoice-1];
            
        
        //canvas.printWin(canvas.width/2 + 135, 150, payoffVector[winChoice])
        // Adds pointer
        canvas.triangle(canvas.width/2+20, 60, 15).attr({
          "fill": "black", 
          "stroke": 0}).transform("r180");
        
        // Creates spinner
        spinner = canvas.pieChart(canvas.width/2+20, 200, 125, probabilityVector, payoffVector,
          colors);

        hand = canvas.image("images/hand.png", canvas.width/2-200, 50, 64, 48).transform("r90");
        goButton = canvas.rect(canvas.width/2-220,20,90,25,0).attr({fill: "#0f0"});
        goButtonLabel = canvas.text(canvas.width/2-175,10,"Go!").attr({"font-size": 17});

        goButton.click(function() {
          hand.animate(
            {transform: "r90,T" + (125 ) + ",0"}, 1000, '<>',  
              function() {
                spinner.animate(
                  {transform: "r" + winningAngle + " " + (canvas.width/2+20) + " " + 200}, 6000, '>',
                  afterSpin)
                  }
              )
        });

/*

        goButton.click(startSpinning());

        function startSpinning() {
          hand.animate(
            {transform: "r90,T" + (canvas.width/4 - 170) + ",0"}, 1000, '<>',  
              function() {
                spinner.animate(
                  {transform: "r" + winningAngle + " " + canvas.width/2 + " " + 150}, 6000, '>',
                  afterSpin)
                  }
              )
        }
*/

        /*
        spinner.click(function() {
        spinner.animate(
          {transform: "r" + winningAngle + " " + canvas.width/2 + " " + 150}, 6000, '>',
          afterSpin)
        });
         spinner.animate({transform: "r" + amount_in_degrees + " " + center_x
         + " " + center_y}, duration_in_milliseconds, easing_formula, optional_callback);
        */

        function afterSpin() {
          var winningPayoff = payoffVector[winChoice-1];
          $('#Outcome').html(winningPayoff);
          $("#response").show(); 
          //setTimeout(function(){$("#response").show(); $('#response').text("The results is:" + winningPayoff);}, 6000);
          //$('#response').text("The results is:  " + winningPayoff);
          //document.getElementById("response").innerText(charName + "has won $" + winningPayoff);
          //document.write(charName) document.write(winningPayoff)
        }






          //$("#condition").html(experiment.condition);
          //currentTrialNum = shuffledOrder[numComplete];
          //trial = allTrialOrders[currentTrialNum];
          //          showSlide("stage");



            numComplete++;
          }
            // var startTime = (new Date()).getTime();
            // var endTime = (new Date()).getTime();
            //key = (keyCode == 80) ? "p" : "q",
            //userParity = experiment.keyBindings[key],
            // data = {
            //   stimulus: n,
            //   accuracy: realParity == userParity ? 1 : 0,
            //   rt: endTime - startTime
            // };

       // experiment.data.push(data);
     //setTimeout(experiment.next, 500);
  }

  


};

/*
  var canvas=document.getElementById("spinnerCanvas");
  var context=canvas.getContext("2d");
  var centerX = canvas.width / 2;
  var centerY = canvas.height / 2;
  var radius = 30;

  context.beginPath();
  context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  context.fillStyle = "black";
  context.fill();
  context.lineWidth = 1;
  context.strokeStyle = "black";
  context.stroke();
  */