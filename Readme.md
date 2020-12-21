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
2. Get Hierarchy of user based on role name
```
    POST
    curl --location --request POST 'http://localhost:3000/gethierarchy' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "roleName":"Journalist"
    }'
```
3. Get All users
```
    GET
    curl --location --request GET 'http://localhost:3000/users'
```

# Task 3
This folder has UI for -
1. Adding employee
2. Get Hierarchial order of employee (search based on role name)

Steps - 
```
    1. Clone the repo
    2. cd Task3
    3. yarn
    4. yarn start

```