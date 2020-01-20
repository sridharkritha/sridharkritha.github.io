// creates an empty object without a prototype
var obj = Object.create(null); // obj.prototype
obj.__proto__ = 'sridhar';
console.log(obj.__proto__); // sridhar
console.log(obj); // Error (no toString)

