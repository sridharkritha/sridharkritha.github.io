
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

    function myFunction() 
    { 
        var name, age; 
        name = document.getElementById("inputName").value;
        age  = parseInt(document.getElementById("inputAge").value);
        document.getElementById("displayElement").innerHTML = name +" " + age; 
    }
}) // window.addEventListener('load', function() {