
window.addEventListener('load', function() {

/*
1. Grouping 100% chance winners
2. Grouping one half 100% winners and another half 90% winners
3. 2 folds -> 100% + (90 - 95)%
4. 3 folds -> 100% + 100% + (90 - 95)%
5. 4 folds -> 100% + 100% + 100% + (90 - 95)%
6. 5 folds -> 100% + 100% + 100% + (90 - 95)% + (80 - 90)%

Note: 
1. EW cann't be folder in Win only

*/



var raceData = [];
var pageNoCurr = 0; // current page number
var pageNoTotal = 0; // total page numbers
var prevPosition = 0;
document.getElementById('btnFoldId').onclick = function () { }
document.getElementById('btnPrevId').onclick = function () 
{ 
    /*
    // Browse the object in ascending order / in the order creation 
    for (var key in raceData) {
        if (raceData.hasOwnProperty(key)) {
           var obj = raceData[key];
           for (var prop in obj) {
              if (obj.hasOwnProperty(prop)) {
                 alert(prop + " = " + obj[prop]);
              }
           }
        }
     }
     */      
        var key = 0; 
        
        if(pageNoCurr)
        {
            --pageNoCurr;
            key = pageNoCurr;
        }

        populateRaceCard(key);     
}

function populateRaceCard(key)
{
    // Browse the object in Desending order
    // for(var key = raceData.length - 1; key >= 0; --key)

    if (raceData.hasOwnProperty(key)) {
        var obj = raceData[key];
        for (var prop in obj) {
           if (obj.hasOwnProperty(prop)) {
              // alert(prop + " = " + obj[prop]);
              switch(prop)
              {
                  case "time":
                    document.getElementById("timeId").value = obj[prop];
                    break;
                  case "nRunners":
                    document.getElementById("nRunnersId").value = obj[prop];
                    break;
                  case "horse":
                    document.getElementById("horseId").value = obj[prop];
                    break;
                  case "odd":
                    document.getElementById("oddId").value = obj[prop];
                    break;
                  case "winPercentage":
                    document.getElementById("winPercentageId").value = obj[prop];
                    break;
              }                    
           }
        }
     }

}

document.getElementById('btnNextId').onclick = function () 
{   
    if(pageNoCurr === pageNoTotal)
    {
        ++pageNoCurr; 
        pageNoTotal = pageNoCurr;

        time = document.getElementById("timeId").value;
        nRunners = document.getElementById("nRunnersId").value;
        horse = document.getElementById("horseId").value;
        odd = document.getElementById("oddId").value;
        winPercentage = document.getElementById("winPercentageId").value;
        // DB: Race meeting 
        raceData.push({time:time,horse:horse,odd:odd,winPercentage:winPercentage,nRunners:nRunners});
    
        clear();
    }
    else if(pageNoCurr < pageNoTotal)
    {
        ++pageNoCurr; 
        populateRaceCard(pageNoCurr);
    }
   
}

function clear()
{
    document.getElementById("timeId").value = '';
    document.getElementById("horseId").value = '';
    document.getElementById("oddId").value = '';
    document.getElementById("winPercentageId").value = '';
    document.getElementById("nRunnersId").value = '';
}

}); // window.addEventListener('load', function() {