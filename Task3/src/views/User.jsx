import React, { Component } from "react";
import { Card } from "components/Card/Card.jsx";

import Button from "components/CustomButton/CustomButton.jsx";
import NotificationSystem from "react-notification-system";
import { style } from "variables/Variables.jsx";
import axios from "axios";
import { Grid, Row, Col } from "react-bootstrap";
import { withCookies } from "react-cookie";
import "./CommonStyle.css";
import { API_URL } from "../variables/config"

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      hierarchyData: null
    };
  }
  componentDidMount() {
  }
  getHierarchy = async () => {
    const { searchText } = this.state
    if (!searchText) {
      this.showNotification("error", "Please enter role name");
      return;
    }
    let data = {
      roleName: searchText
    }
    axios.post(`${API_URL}gethierarchy`, data)
      .then(async response => {
        console.log(response)
        if (response && response.status && response.data && response.data.data.length !== 0) {
          await this.setState({
            hierarchyData: response.data.data
          })
        }
      })
      .catch(error => {
        console.log(error)
        this.showNotification("error", 'Error while fetching hierarchy')
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
  render() {
    const { hierarchyData, searchText } = this.state
    return (
      <div className="content">
        <NotificationSystem ref="notificationSystem" style={style} />

        <Grid fluid>
          <Row>
            <Col md={12}>
              <Card
                title="Get Hierarchy of Employee (Search by Role Name)"
                content={
                  <>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >

                      <input type="text"
                        value={searchText}
                        onChange={e => this.setState({ searchText: e.target.value })}
                        placeholder="Enter Role Name e.g. Journalist, Head of Content"
                        style={{ padding: 10, width: '80%', borderRadius: 20, borderWidth: .7 }} />


                      <Button
                        bsStyle="info"
                        pullRight
                        fill
                        type="button"
                        onClick={this.getHierarchy}
                        style={{
                          marginLeft: 20,
                          borderRadius: 20,
                          alignSelf: "flex-end",
                        }}
                      >
                        Get Hierarchy
                    </Button>
                    </div>
                    <Row>
                      {
                        hierarchyData && hierarchyData.length !== 0 &&
                        <div style={{
                          display: 'flex',
                          flexDirection: 'row',
                          width: 400,
                          margin: 20,
                          justifyContent: 'space-between',

                        }}>
                          <div style={{
                            display: 'flex',
                            width: 200, borderBottomWidth: .7,
                            borderBottomColor: '#333',
                            padding: 10,
                            borderBottomStyle: "double",
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'bold'
                          }}>Employee Name</div>
                          <div style={{
                            display: 'flex',
                            width: 200, borderBottomWidth: .7,
                            borderBottomColor: '#333',
                            padding: 10,
                            marginLeft: 5,
                            borderBottomStyle: "double",
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontWeight: 'bold'
                          }}>Role Name</div>
                        </div>
                      }

                      {
                        hierarchyData && hierarchyData.length !== 0 &&
                        hierarchyData.map((item, index) => {
                          return (
                            <div
                              key={index}
                              style={{
                                display: 'flex',
                                flexDirection: 'row',
                                width: 400,
                                margin: 20,
                                marginTop: 5,
                                justifyContent: 'space-between',

                              }}>
                              <div style={{
                                display: 'flex',
                                width: 200, borderBottomWidth: .7,
                                borderBottomColor: '#333',
                                padding: 10,
                                borderBottomStyle: "double",
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>{item.EmployeeName}</div>
                              <div style={{
                                display: 'flex',
                                width: 200, borderBottomWidth: .7,
                                borderBottomColor: '#333',
                                padding: 10,
                                marginLeft: 5,
                                borderBottomStyle: "double",
                                justifyContent: 'center',
                                alignItems: 'center',

                              }}>{item.RoleName}</div>
                            </div>
                          )
                        })
                      }
                    </Row>
                  </>
                }
              />
            </Col>
          </Row>


        </Grid>
      </div>
    );
  }
}
export default withCookies(User);
