# mackintosh

# Installing mackintosh
After cloning the repository, you will need to install Node.js and Npm. If you run the commands:
npm -v and node -v

You will see what version (if any) of Npm and Node.js respectively you have on your machine. If you already have it, make sure you are using:
Npm: 6.14.11
Node.js: v14.15.5

If you do not have Node.js or Npm installed, you can follow this link to install it for you platform of choice: https://nodejs.org/en/download/

Once you have downloaded Node.js and Npm and have successfully cloned the repository, navigate to the directory your respository is stored in. Then, run the command:
npm install

This command will install all of the node packages used in this project, including TypeScript. This should create a folder called node_modules and a package-lock.json file.

# Running mackintosh
To compile the project, run the command:
tsc

If changes were made to files in the mackintosh module, be sure to run the command:
tsc --module none --target es5 --outFile dist/mackintosh.js

This command will update the mackintosh.js module to include your changes. Once the project is compiled, the index.html file can be opened in the browser.

# Code Refrences

TypeScript and gulp setup: https://www.typescriptlang.org/docs/handbook/gulp.html

# Grading

At the time of the due date, all current changes will be merged into main. Project development will take place on a corresponding branch. Please pull from main when it is time to grade.
