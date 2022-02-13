# GenPare: Frontend 

Welcome to the Frontend-Repository of GenPare! The following steps will help you to set up the Angular-Application locally. 

## Installing

### Prerequisites:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/

### Building the image

If you already have a frontend image present, you need to remove it, or changes won't be applied. To check if you have an image present use `docker ps`.

To run the frontend in a container use: 
`docker-compose up`.

### Install Angular 

As an alternative to docker you can use the following instruction to install the frontend locally. As this is an Angular-Application, Angular and [Node.js](https://nodejs.org/en/download/) (v14.18.1) are required. If not already installed, install Node.js first. Then, install the Angular CLI via npm by running the following command: `npm install -g @angular/cli`.

### Install Dependencies

When Angular is installed, clone the repository, open up a command line and head into the root directory (main-folder). To install all required dependencies, run the command `npm install`. 

## Starting

To start the frontend, stay in the root-directory of the repository and type `ng serve --open`. The Angular CLI will compile and build the Application and open a new tab in your browser.