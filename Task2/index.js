var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
var fs = require("fs");
var { v4: uuidv4 } = require('uuid')

app.use(bodyParser());
app.use(bodyParser.json());
app.use(cors());

var filePath = `${__dirname}/users.json`


app.post('/adduser', async (req, res) => {
    // First read existing users.
    const {
        name, role
    } = req.body
    if (!name) {
        res.status(400).send({
            status: false,
            message: "Name is required",
        });
        return;
    }
    if (!role) {
        res.status(400).send({
            status: false,
            message: "Role is required",
        });
        return;
    }
    let users = await loadData()
    if (users && users.data) {
        let data = JSON.parse(users.data)
        data.push({
            id: uuidv4(),
            name,
            role
        })
        let isRecordAdded = await storeData(data)
        console.log(isRecordAdded)
        if (isRecordAdded.status) {
            users = await loadData()
            res.status(200).send({
                status: true,
                data: JSON.parse(users.data),
            });
        }
        else{
            res.status(400).send({
                status: false,
                message: "Error while adding user",
              });
        }
    }
})

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

