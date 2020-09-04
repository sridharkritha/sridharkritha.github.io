// Javascipt classes:
class Person {
    constructor(name) { this.name  = name; }
    greet() { console.log(`Hello ${this.name}`); }
}

class Student extends Person {
    constructor(name, level) {
        super(name);
        this.level = level;
    }
    greet() { console.log(`Hello ${this.name} from ${this.level}`); }
} 

const o1 = new Person('Sridhar');
const o2 = new Student("Jay", "1st Grade");
const o3 = new Student("Janani", "2st Grade");
o3.greet = () => console.log("I am special");
o1.greet();
o2.greet();
o3.greet();

////////////////////////////////////////////////////////////////////
// By default most of browser supports "fetch api"
// fetch(...) and resp.json() both are async and returns promise object. These needs to chained by ".then"
// Method 1: Promises
// const fetchData = () => {
//   fetch('https://api.github.com').then(resp => {
//     resp.json().then(data => {
//       console.log(data);
//     });
//   });
// };

// Method 2: Async / Await
const fetchData = async () => {
    const resp = await fetch('https://api.github.com');
    const data = await resp.json();
    console.log(data);
  };
  
  fetchData();

  //////////////////////////////////////////////////////////////////////////////////////