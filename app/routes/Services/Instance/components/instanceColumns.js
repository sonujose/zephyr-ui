import React, { useEffect, useState } from 'react';
import {
    UncontrolledTooltip,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Badge
} from './../../../../components'
import moment from 'moment';

const sortCaret = (order) => {
    if (!order)
        return <i className="fa fa-fw fa-sort text-muted"></i>;
    if (order)
        return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>
}

// Generating Pod final Status based on container conditions
//cell[0] - type:Initialized, cell[1] - type:Ready
//cell[2] - type:ContainersReady, cell[3] - type:PodScheduled
const getPodCondition = (item) => {
    let uniqueId = Math.floor(Math.random() * 100) + 1
    if (item == null || item.length < 4) {
        return { status: "danger", condition: "Unscheduled", id: uniqueId }
    } else {
        if (item[1].status == "True" && item[2].status == "True") {
            return { status: "success", condition: "Running", id: uniqueId }
        } else if (item[3].status == "False") {
            return { status: "warning", condition: "scheduling", id: uniqueId }
        } else if (item[0].status == "True") {
            return { status: "danger", condition: "Crashloop", id: uniqueId }
        }
    }
}

const columns = [
    {
        dataField: 'metadata.name',
        text: 'Name',
        sort: true,
        sortCaret,
        formatter: (cell) => {
            const gettrimmed = (input) => {
                if (input.length > 30) {
                    return input.substring(0, 30) + '...';
                } else {
                    return input
                }
            }
            return (
                <>
                    <span id={cell}>{gettrimmed(cell)}</span>
                    <UncontrolledTooltip placement="top" target={cell}>
                        {cell}
                    </UncontrolledTooltip>
                </>

            )
        }
    },
    {
        dataField: 'status.containerStatuses',
        text: 'Status',
        sort: false,
        formatter: (cell) => {
            if (cell != null) {
                return (
                    <>
                        {cell.map((item) => {
                            return (
                                <>
                                    <div id={item.name}
                                        style={{
                                            width: "10px",
                                            height: "10px",
                                            borderRadius: "2px",
                                            backgroundColor: item.ready ? "green" : "red",
                                            display: "inline-block",
                                            margin: "0 2px"
                                        }}>
                                    </div>
                                    <UncontrolledTooltip
                                        placement="top"
                                        target={item.name}
                                    >
                                        {item.ready ?
                                            <div style={{ textAlign: "left" }}>
                                                <div>
                                                    <b>{item.name}</b>
                                                    <i>
                                                        ({Object.keys(item.state)[0]}, {item.started ? "Ready" : "Not Ready"})
                                                    </i>
                                                </div>
                                                <div>Started At : {item.state[Object.keys(item.state)[0]].startedAt}</div>
                                            </div>
                                            : ""}
                                    </UncontrolledTooltip>
                                </>
                            )
                        })}

                    </>
                );
            } else {
                return <></>
            }

        }
    },
    {
        dataField: 'status.podIP',
        text: 'Pod IP',
        sort: false,
        formatter: (cell) => {
            return (
                <span>{cell}</span>
            )
        }
    },

    {
        dataField: 'status.qosClass',
        text: 'QosClass',
        sort: false,
        formatter: (cell) => {
            return (
                <span>{cell}</span>
            )
        }
    },
    {
        dataField: 'metadata.ownerReferences',
        text: 'Controller',
        sort: false,
        formatter: (cell) => {
            if (cell != null) {
                const getController = (owners) => {
                    let controllernames = owners[0].kind
                    for (let index = 1; index < owners.length; index++) {
                        const element = owners[index];
                        controllernames += "," + element.kind
                    }
                    return controllernames
                }
                if (cell != null) {
                    return <>{getController(cell)}</>
                }
            } else {
                return <></>
            }

        }
    },
    {
        dataField: 'spec.nodeName',
        text: 'Node',
        sort: false,
        formatter: (cell) => {
            return (
                <span>{cell}</span>
            )
        }
    },
    
    {
        dataField: 'metadata.creationTimestamp',
        text: 'Age',
        sort: false,
        formatter: (cell) => {
            return (
                <span>{moment(cell).fromNow(true)}</span>
            )
        }
    },
    {
        dataField: 'status.conditions',
        text: 'State',
        sort: false,
        formatter: (cell) => {
            return (
                <>
                <Badge color={getPodCondition(cell).status}>
                        {getPodCondition(cell).condition}
                    </Badge>
                    {/* <text className={`text-${getPodCondition(cell).status}`}>{getPodCondition(cell).condition}</text> */}
                </>
            );
        }
    },
    {
        dataField: 'metadata.uid',
        text: 'Action',
        sort: false,
        formatter: (cell) => {
            return (
                <UncontrolledButtonDropdown>
                    <DropdownToggle color="link" className={`text-decoration-none`}>
                        <i className="fa fa-gear"></i><i className="fa fa-angle-down ml-2"></i>
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <i className="fa fa-fw fa-align-left mr-2"></i>
                            Logs
                        </DropdownItem>
                        <DropdownItem>
                            <i className="fa fa-fw fa-edit mr-2"></i>
                            Edit
                        </DropdownItem>
                        <DropdownItem>
                            <i className="fa fa-fw fa-remove mr-2"></i>
                            Delete
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
            )
        }
    },
];

export function getServiceInstanceColumns() {
    return columns;
}

