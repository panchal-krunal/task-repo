var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
var fs = require("fs");
var { v4: uuidv4 } = require('uuid')

app.use(bodyParser());
app.use(bodyParser.json());
app.use(cors());


// file path of users.json
var filePath = `${__dirname}/users.json`

// method to add user
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
        else{
            // else show that user is not added and written to the file
            res.status(400).send({
                status: false,
                message: "Error while adding user",
              });
        }
    }
})

// function to write the file accepts data as parameter of type (object{})
const storeData = (data) => {
    try {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, JSON.stringify(data), (error) => {
                if (error) {
                    reject({ status: false, message: "Error while writing data" });
                    return;
                }
                resolve({
                    status: true,
                    message: "Record added successfully",
                });
            })
        })
    } catch (err) {
        console.error(err)
        reject({ status: false, message: "Error while writing data" });
    }
}
// function to get users data from users.json file
const loadData = () => {
    try {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    reject({ status: false, message: "Error while fetching data" });
                    return;
                }

                resolve({
                    status: true,
                    data,
                    message: "Record fetched successfully",
                });
            })
        })

    } catch (err) {
        console.log(err)
        reject({ status: false, message: err.message });
    }
}


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App is listening on port ${port}.`));

