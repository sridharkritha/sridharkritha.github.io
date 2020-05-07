
this.id = 'hello';
console.log(this); // { id: 'hello'}

const testObj = {
    func1: function()    { console.log(this); }, // { func1: [Function: func1], func2: [Function: func2] }
    func2:         () => { console.log(this); }  // { id: 'hello'}
};

testObj.func1();
testObj.func2();