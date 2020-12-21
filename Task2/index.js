var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
var { v4: uuidv4 } = require('uuid')

var { storeData, loadData,getHierarchy } = require("./helper")

app.use(bodyParser());
app.use(bodyParser.json());
app.use(cors());


// API to add user
app.post('/adduser', async (req, res) => {
    const {
        name, role
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
    if (!role) {
        res.status(400).send({
            status: false,
            message: "Role is required",
        });
        return;
    }
    // get existing users
    let users = await loadData()
    // if users exists
    if (users && users.data) {
        // get user array
        let data = JSON.parse(users.data)
        // add the user object from request body to the existing users array
        data.push({
            id: uuidv4(),
            name,
            role
        })
        // write the file
        let isRecordAdded = await storeData(data)
        // if user is added and file is written
        if (isRecordAdded.status) {
            // get the users data
            users = await loadData()
            // show the response with all data
            res.status(200).send({
                status: true,
                data: JSON.parse(users.data),
            });
        }
        else {
            // else show that user is not added and written to the file
            res.status(400).send({
                status: false,
                message: "Error while adding user",
            });
        }
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
    let data = await getHierarchy('Journalist')
    res.send(data)
})


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

