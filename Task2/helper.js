var fs = require('fs')
const DB = require('./DB');
var { v4: uuidv4 } = require('uuid')
// file path of users.json
var filePath = `${__dirname}/users.json`
var rolesFilePath = `${__dirname}/roles.json`

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

const loadDataFromDB = () => {
    try {
        return new Promise((resolve, reject) => {
            try {
                let query = 'select e.Name as EmployeeName, e.Salary as EmployeeSalary, r.Name as RoleName, e.EmployeeId as EmployeeId from Employees e inner join Roles r on e.RoleId = r.RoleId';
                DB.query(query, null, (err, res) => {
                    if (err) {
                        reject({ status: false, message: "Error while fetching data" });
                        return;
                    }
                    resolve({ status: true, message: "Data fetched successfully", data: res });
                })
            }
            catch (error) {
                console.error(err)
                reject({ status: false, message: "Error while fetching data" });
            }

        })

    } catch (err) {
        console.log(err)
        reject({ status: false, message: err.message });
    }
}

const getRoles = () => {
    try {
        return new Promise((resolve, reject) => {
            try {
                let query = 'select r.Name RoleName, r.RoleId RoleId from Roles r order by r.Name';
                DB.query(query, null, (err, res) => {
                    if (err) {
                        reject({ status: false, message: "Error while fetching data" });
                        return;
                    }
                    resolve({ status: true, message: "Data fetched successfully", data: res });
                })
            }
            catch (error) {
                console.error(err)
                reject({ status: false, message: "Error while fetching data" });
            }

        })

    } catch (err) {
        console.log(err)
        reject({ status: false, message: err.message });
    }
}

const storeDataInDB = (data) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `insert into employees (EmployeeId, Name,RoleId,Salary) values('${data.id}','${data.name}','${data.roleId}',${data.salary})`
            console.log(query)
            DB.query(query, null, (err, res) => {
                if (err) {
                    reject({ status: false, message: "Error while uploading data" });
                    return;
                }
                resolve({ status: true, message: "Data uploaded successfully" });
            })

        } catch (err) {
            console.error(err)
            reject({ status: false, message: "Error while writing data" });
        }
    })
}

// helper function to get hierarchy of users 
// based on role name accepts parameter roleName of type string

const getHierarchy = (roleName) => {
    return new Promise((resolve, reject) => {
        try {
            let query = `select r.Name RoleName  ,e.Name EmployeeName from Employees e  inner join Roles r on e.RoleId  = r.RoleId  left join Roles r2 on r.ParentId = r2.RoleId where r2.Name = '${roleName}'`;

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


/// Task 1 helper function

const getSubordinates = (id) => {
    try {
        return new Promise((resolve, reject) => {
            let users = []
            if (id === 1) {
                fs.readFile(filePath, 'utf8', (fileError, fileData) => {
                    if (fileError) {
                        reject({ status: false, message: "Error while fetching data" });
                        return;
                    }
                    fileData = JSON.parse(fileData)

                    fileData.map(userItem => {
                        if (id !== userItem.role) {
                            users.push(userItem)
                        }
                    })
                    resolve(users)
                })
            }
            else {
                fs.readFile(rolesFilePath, 'utf8', (err, data) => {
                    if (err) {
                        reject({ status: false, message: "Error while fetching data" });
                        return;
                    }
                    data = JSON.parse(data)
                    let filterResult = data.filter(item => item.parentId.toString() === id.toString())
                    if (filterResult && filterResult.length !== 0) {

                        fs.readFile(filePath, 'utf8', (fileError, fileData) => {
                            if (fileError) {
                                reject({ status: false, message: "Error while fetching data" });
                                return;
                            }
                            fileData = JSON.parse(fileData)
                            filterResult.map(item => {
                                fileData.map(userItem => {
                                    if (item.id === userItem.role) {
                                        users.push(userItem)
                                    }
                                })
                            })
                            resolve(users)
                        })


                    }

                })
            }
        })

    } catch (err) {
        console.log(err)
        reject({ status: false, message: err.message });
    }
}

module.exports = {
    storeData,
    loadData,
    loadDataFromDB,
    storeDataInDB,
    getHierarchy,
    getRoles,
    getSubordinates
}