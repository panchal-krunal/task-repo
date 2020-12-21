import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import axios from "axios";
import { Grid, Row, Col } from "react-bootstrap";
import { withCookies } from "react-cookie";
import { API_URL } from "../variables/config"
import "./CommonStyle.css";
class AddUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeName: '',
            roles: null,
            salary: '',
            selectedRoleId: 0
        };
    }
    componentDidMount() {
        this.getRoles()
    }

    getRoles = async () => {
        axios.get(`${API_URL}roles`)
            .then(async response => {
                if (response && response.data && response.data.data && response.data.data.length !== 0) {
                    console.log(response.data.data)
                    await this.setState({ roles: response.data.data })
                }
            })
            .catch(error => {
                console.log(error)
                this.showNotification('error', 'Error while fetching roles')
            })
    }
    showNotification = (level, message) => {
        this.setState({ _notificationSystem: this.refs.notificationSystem });
        var _notificationSystem = this.refs.notificationSystem;
        _notificationSystem.addNotification({
            title: (
                <span
                    data-notify="icon"
                    className={level === "error" ? "pe-7s-info" : "pe-7s-check"}
                />
            ),
            message: <div>{message}</div>,
            level: level,
            position: "tr",
            autoDismiss: 5,
        });
    };
    addUser = async () => {
        const { employeeName, selectedRoleId, salary } = this.state;
        if (!employeeName) {
            this.showNotification('error', 'Please enter employee name')
            return
        }
        if (!salary) {
            this.showNotification('error', 'Please enter salary')
            return
        }
        if (!selectedRoleId) {
            this.showNotification('error', 'Please select role')
            return
        }
        let payload = {
            name: employeeName,
            roleId: selectedRoleId,
            salary
        }
        axios.post(`${API_URL}adduser`, payload)
            .then(response => {
                console.log(response)
                this.setState({ salary: '', selectedRoleId: 0, employeeName: '' })
                this.showNotification('success', 'Employee added successfully')
            })
            .catch(error => {
                console.log(error)
                this.showNotification('error', 'Error while adding employee')
            })

    }
    render() {
        const { employeeName, roles, salary, selectedRoleId } = this.state
        return (
            <div className="content">
                <NotificationSystem ref="notificationSystem" style={style} />

                <Grid fluid>
                    <Row>
                        <Col md={6}>
                            <Card
                                title="Add Employee"
                                content={
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "flex-start",
                                        }}
                                    >

                                        <input type="text"
                                            value={employeeName}
                                            onChange={e => this.setState({ employeeName: e.target.value })}
                                            placeholder="Employee Name"
                                            style={{ padding: 10, width: 300, borderWidth: .7 }} />

                                        <input type="number"
                                            value={salary}
                                            onChange={e => this.setState({ salary: e.target.value })}
                                            placeholder="Salary"
                                            style={{ padding: 10, width: 300, borderWidth: .7, marginTop: 10 }} />
                                        <select
                                            style={{ padding: 10, width: 300, marginTop: 10 }}
                                            value={selectedRoleId}
                                            onChange={async (e) =>
                                                await this.setState({ selectedRoleId: e.target.value })
                                            }
                                        >
                                            <option value="SELECT">- Select Role -</option>

                                            {
                                                roles && roles.length !== 0 &&
                                                roles.map((item, index) => {
                                                    return (
                                                        <option value={item.RoleId} key={index}>{item.RoleName}</option>
                                                    )
                                                })
                                            }
                                        </select>

                                        <Button
                                            bsStyle="info"
                                            pullRight
                                            fill
                                            type="button"
                                            onClick={this.addUser}
                                            style={{
                                                marginLeft: 20,
                                                borderRadius: 20,
                                                marginTop: 20,
                                                alignSelf: "flex-end",
                                            }}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                }
                            />
                        </Col>
                    </Row>

                </Grid>
            </div>
        );
    }
}
export default withCookies(AddUser);
