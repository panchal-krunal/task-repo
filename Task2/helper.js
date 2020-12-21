var fs = require('fs')
const DB = require("./db.js");
// file path of users.json
var filePath = `${__dirname}/users.json`

// helper function to write the file accepts data as parameter of type (object{})
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
// helper function to get users data from users.json file
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

// helper function to get hierarchy of users 
// based on role name accepts parameter roleName of type string

const getHierarchy = (roleName) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `select r.Name  ,e.Name from Employees e  inner join Roles r on e.RoleId  = r.RoleId  left join Roles r2 on r.ParentId = r2.RoleId where r2.Name = '${roleName}'`;

            DB.query(query, null, (err, res) => {
                if (err) {
                    reject({ status: false, message: "Error while fetching data" });
                    return;
                }
                resolve({
                    status: true,
                    data: res,
                    message: "Record fetched successfully",
                });
            });
        } catch (ex) {
            reject({ status: false, message: ex.message });
        }
    });
}


module.exports = {
    storeData,
    loadData,
    getHierarchy
}