window.addEventListener('load', function() {

	document.querySelector('select[id="car"]').onchange=ChangeCarList;



var carsAndModels = {};
carsAndModels['VO'] = ['V70', 'XC60', 'XC90'];
carsAndModels['VW'] = ['Golf', 'Polo', 'Scirocco', 'Touareg'];
carsAndModels['BMW'] = ['M6', 'X5', 'Z3'];

function ChangeCarList() {
    var carList = document.getElementById("car");
    var modelList = document.getElementById("carmodel");
    var selCar = carList.options[carList.selectedIndex].value;
    while (modelList.options.length) {
        modelList.remove(0);
    }
    var cars = carsAndModels[selCar];
    if (cars) {
        var i;
        for (i = 0; i < cars.length; i++) {
            var car = new Option(cars[i], i);
            modelList.options.add(car);
        }
    }
}

}); // window.addEventListener('load', function() {