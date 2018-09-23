// function car(m, c) {
// 	return 'Car model is ' + m + ' and Colour is ' + c; 
// }

// function motorBike() {
//     console.log(this);
// 	return 'MotorBike model is ' + arguments[0] + ' and Colour is ' + arguments[0]; 
// }

// //console.log(car('BMW', 'Blue'));
// // console.log(motorBike('Bajaj', 'Red'));
// motorBike('Bajaj', 'Red');


var ctx = { model: 'BMW', colour:'Blue'}
motorBike = motorBike.bind(ctx);
var s = motorBike();
console.log(s);
function motorBike() {
    console.log(this); // { model: 'BMW', colour: 'Blue' }
	return 'MotorBike model is ' + this.model + ' and Colour is ' + this.colour; 
}

// function car(m, c) {
//     console.log(this);
// 	return 'Car model is ' + m + ' and Colour is ' + c; 
// }

// car.call(ctx,'BMW', 'Blue');



// var s = motorBike.apply(ctx,['Bajaj', 'Red'])




