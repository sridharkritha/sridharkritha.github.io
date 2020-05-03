1. initialize a nodejs project with default settings. It creates 'package.json'
    npm init -y

2. If you downloaded 'package.json' from somewhere else then  install all necessary packages by
    npm install
    npm start

    npm start : run the 'js' file which is defined for "start" inside the "package.json"
    ex:

      "scripts": {
        "start": "node server.js"
      },

      If you use "nodemon" then "scripts" looks like below

    "scripts": {
        "start": "nodemon server.js"
      },

3. Install the packages manually
    npm i express

   Install the package globally by "-g"
    npm i nodemon -g

   Include the installed packages names in "dependencies" "object of package.json" by "--save"

   npm i express --save            // save the package under "dependencies"
   npm i express --save-dev       // save the package under "devDependencies"
   npm i express --save-optional  // save the package under "optionalDependencies"

  4. Uninstall the package manually
   npm uninstall express
   npm uninstall express --save            // Now --save option become default so it is optional now
   npm uninstall express --save-dev       // save the package under "devDependencies"
   npm uninstall express --save-optional  // save the package under "optionalDependencies"



8. Ignore "node_modules" from git push
  Add below lines in a file '.gitignore' (create at root folder if it is not exist)

####################################################################################################################
# Don't push anything from the 'node_modules' folder. Do the recursively do the same for inner directories by '**/'
**/node_modules

# Except this file
!.gitignore
####################################################################################################################










    Node Packages:
    Node.js : Is a runtime environment built on Chrome’s V8 JavaScript engine for server-side and networking application. 
    express : Http server
    multer  : Parse the form elements. Middleware for Handling multipart/form-data and store the files in the file directory
    nodemon : server for auto restart if there is a change in the server code
    uuid    : getting the random name
    ejs     : template engine


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

How to debug the nodejs based server.js using visual code:
1. Turn on "Node: Auto Attach" by go to command palette: Ctrl + P and Click "Node: Auto Attach"
2. In the console start the debug using
    node --inspect=0.0.0.0:9229 server.js
    // 9229 is the default port for debugging when using the --inspect flag 
3. Debugger will starts automatically. So set the break points wherever you likes.
// Ref: https://medium.com/the-node-js-collection/debug-your-node-js-app-in-60-seconds-9ee942a453f0
// https://www.digitalocean.com/community/tutorials/how-to-debug-node-js-code-in-visual-studio-code

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Url Tips:
How to make a webpage not to use any cache ?
Include "?" or "&" as appropriate with some "random number" in the url link

ex: 
1. http://foo.com/bar.html                => http://foo.com/bar.html?12345
2. http://foo.com/bar.html?foobar=baz     => http://foo.com/bar.html?foobar=baz&12345

As the local cache is indexed by URL, this causes every request to be unique, thereby bypassing the cache.

You can automatically adjust URLs using the following code:
/*************************************************************************************/
var oReq = new XMLHttpRequest();
oReq.open("GET", url + ((/\?/).test(url) ? "&" : "?") + (new Date()).getTime());
oReq.send(null);
/*************************************************************************************/






