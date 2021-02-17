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

This command will install all of the node packages used in this project, including TypeScript and Express. This should create a folder called node_modules and a package-lock.json file.

# Running mackintosh
Once you have installed the compiler, run the command:
npm start

This command will start the server and transpile changes made. Then, you can nagivate to localhost:3000 to view the mackintosh compiler.

# Code Refrences

TypeScript and Express server setup refrenced: https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript
