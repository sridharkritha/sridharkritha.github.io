
///////////////////////////////////////////////////////////////////////////////////////
npm i eslint -D


    "scripts": {
        "lint": "eslint"
    }

    npm run lint -- --init

    .eslintrc.json file will be created.

    Then add '.'

    "scripts": {
        "lint": "eslint ."
    }

    npm run lint


    why eslint is not working ??
///////////////////////////////////////////////////////////////////////////////////////
"scripts": {
    "start": "nodemon app.js",
}

"nodemonConfig": {
    "restartable": "rs",
    "ignore": [
      "node_modules/**/node_modules"
    ],
    "delay": "2500",
    "env": {
      "NODE_ENV": "development",
      "PORT": 4000
    }
  }


  npm start

  NOTE: only 'npm start' and 'npm test' does't need to say like - npm run start

  //////////////////////////////////////////////////////////////////////////////////

 


    ////////////////////////////////////////////////////////////////////
    Javascript Date():
    Date  2 -> 2 NOT 1. Date range (1 - 31) - Matches with normal convention. Others counts starts from 0
    Month 2 -> March NOT February. January is 0. Month range ( 0 - 11)    
    Day   2 -> 1 NOT 2. Day of a week range (0 - 6)
    Hour  2 -> 1 NOT 2. Hours range (0-23)

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////















