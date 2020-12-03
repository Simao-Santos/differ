A very common problem in software development is to fix something and create a new bug elsewhere for unexpected or unforeseen reasons. To ensure that this doesn’t happen too often (you can never be sure) you need to test the most common parts and actions of your website. Usually those tests are done manually by a QA team and they are very boring, repetitive and most of the times, ineffective. This project is to create a set of pages, store their output before the deployment and compare with the output after the deployment has been done. That comparison needs to be very visual and fast, sending the developer attention to unexpected changes on that set of pages. To prevent the comparison of blocks that are random a set of delimiters for those blocks should be stored against the pages or “group of pages” to remove those blocks from the comparisons. The automated testing should also be able to do a POST to a page with a set of params and also store that output, in all ways similar to what is done in the GET requests.

Work developed for the course of LDSO at FEUP by:
- **Andreia Gouveia (up201706430@fe.up.pt)**
- **Filipe Barbosa (up201909573@fe.up.pt)**
- **Gonçalo Pereira (up201705971@fe.up.pt)**
- **José Matias (up201706413@fe.up.pt)**
- **Pedro Teixeira (up201505916@fe.up.pt)**
- **Ricardo Pinto (up201909580@fe.up.pt)**
- **Simão Santos (up201504695@fe.up.pt)**
- **Tiago Cardoso (up201605762@fe.up.pt)**

The product owner is **Marco Sousa (marco.sousa@zerozero.pt)** of zerozero.pt /ZOS Lda.

# For the Developers

### Adding tests to frontend and backend
Every time a new feature is implemented, unit tests for it should be added. Before accepting a merge request, the developers have to make sure that this rule is being followed.

To add test files to the **frontend** and **backend** you should add them in this folder (t1g1/fe/tests) and this (t1g1/be/tests), respectively. They should have the same file name format as the example there: *filename*.test.js.

To know how to make tests for the backend you can see [here](https://dev.to/nedsoft/testing-nodejs-express-api-with-jest-and-supertest-1km6) for example. For the frontend I also found [this](https://jestjs.io/docs/en/tutorial-react). But obviously you can see anywhere how to make them.

To run them locally, either inside _fe/_ or _be/_ run 'npm run test'.

# Installing instructions

### Docker
To use Docker on your computer start by:

#### Installing Docker:

It is recommended that you install Docker on your Linux distribution. Alternatively, if you want to use Windows and do not own neither Windows 10 Pro nor Windows 10 Entreprise, you may want to use Windows Subsystems for Linux 2 (WSL 2).

For either case follow the instructions in this link https://docs.docker.com/get-docker/

To learn how to enable WSL 2 on your machine go to https://docs.microsoft.com/en-us/windows/wsl/install-win10 and to learn how to integrate Docker and WSL 2 go to https://docs.docker.com/docker-for-windows/wsl/ and follow the instructions.

Note that even though your are using WSL 2 you want to install Docker in Windows 10 and only the docker-compose in Linux.

#### Installing docker-compose:

After completing the installation of Docker you need to install docker-compose. In the link https://docs.docker.com/compose/install/ you will find all the instructions you need to do that, just make sure you are following the instructions to your OS.

#### Using Docker:

To use Docker you must be on the project directory and use the command to build the images that will allow you to see the code working:

```
docker-compose build
```

Then to start the containers use the command:

```
docker-compose up
```

After everything initializes you can check the frontend in the port 3000 and the backend in the port 8000 (insert the url localhost:3000 or similar in your browser).

To stop the containers hit Ctrl+C or the equivalent in your OS. If you use the following command you will need to rebuild the containers:

```
docker-compose down
```

Use this command only if you are having problems with the containers and you need a clean build.

Normally if you made changes to the code you would have to rebuild the containers but if the docker-compose.yml is correctly set, the containers are build with pointers to the actual code so the changes you make can be seen in real time by refreshing the browser you are using. This is only applicable to the frontend, in the backend you need to restart the running container to see the changes.

Be warned the clean builds take their time. Don't be surprised if the first time you are running the build command or after a down command the operation takes time.

**Run the application with** `sh scripts/start.sh`, which grants the needed permissions and runs docker-compose (see !5).

If you want to run the tests, do `sh scripts/start-test_backend.sh` for the backend or `sh scripts/start-test_frontend.sh` for the frontend, which grants the needed permissions and runs docker-compose.test_backend.yml or docker-compose.test_frontend.yml.

#### Errors:

Node 10.18.1 minimum version is needed.

If it appears a message saying that a port is already allocated, for example the 5432 which is the one from the db, you must use the following commands:

```
docker-compose down
docker rm -fv $(docker ps -aq)
sudo lsof -i -P -n | grep 5432
```

In order to run the application you are required to be using Linux OS. Windows users can smoothly run the application by using WSL.