# This repo contains folder for all tasks

## Task 1


## Task 2
This folder contains NodeJS API.
Steps -
1. Clone the repo
2. cd Task2
3. ```yarn```
4. ```node index.js```
5. This will run API on localhost server on port number 3000

To run the api -
1. Add user
```
    POST
    curl --location --request POST 'http://localhost:3000/adduser' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name":"asd",
        "role":1
    }'
```