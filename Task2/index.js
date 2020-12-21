var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
var { v4: uuidv4 } = require('uuid')

var { getHierarchy, loadDataFromDB, storeDataInDB, getRoles } = require("./helper")

app.use(bodyParser());
app.use(bodyParser.json());
app.use(cors());


// API to add user
app.post('/adduser', async (req, res) => {
    const {
        name, roleId, salary
    } = req.body
    // check if name exists in request body else show appropriate message and return
    if (!name) {
        res.status(400).send({
            status: false,
            message: "Name is required",
        });
        return;
    }
    // check if role exists in request body else show appropriate message and return
    if (!roleId) {
        res.status(400).send({
            status: false,
            message: "Role is required",
        });
        return;
    }
    // check if salary is pressent in request body else show appropriate message and return
    if (!salary) {
        res.status(400).send({
            status: false,
            message: "Salary is required",
        });
        return;
    }
    let payload = {
        id: uuidv4(),
        name,
        roleId,
        salary
    }

    // write the file
    let isRecordAdded = await storeDataInDB(payload)
    // if user is added and file is written
    if (isRecordAdded.status) {
        // get the users data
        users = await loadDataFromDB()
        // show the response with all data
        res.status(200).send({
            status: true,
            data: users.data,
        });
    }
    else {
        // else show that user is not added and written to the file
        res.status(400).send({
            status: false,
            message: "Error while adding user",
        });
    }

})

// API to get all users
app.get('/users', async (req, res) => {
    let data = await loadDataFromDB();
    if (data && data.status) {
        res.status(200).send({
            status: true,
            data: data.data,
            message: "Record fetched successfully"
        })
    }
    else {
        res.status(400).send({
            status: false,
            data: [],
            message: "Error while fetching data"
        })
    }
})

// API to get hierarchy of users based on Role Name
app.post('/gethierarchy', async (req, res) => {
    let { roleName } = req.body
    if (!roleName) {
        res.status(400).send({
            status: false,
            message: "Role Name is required",
        });
        return;
    }
    let data = await getHierarchy(roleName)
    res.send(data)
})

app.get('/roles', async (req, res) => {
    let data = await getRoles()
    res.status(200).send({
        status: true,
        data:data.data,
        message: "Roles fetched successfully",
    });
})

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

