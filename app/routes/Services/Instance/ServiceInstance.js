import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import moment from 'moment';
import _ from 'lodash';
import { api } from './../../../api/fetcher'
import {
    UncontrolledTooltip,
    Breadcrumb,
    BreadcrumbItem
} from './../../../components'
import PropagateLoader from "react-spinners/PropagateLoader";

import { CustomSearch } from './components/CustomSearch';

import {
    useLocation,
    Link
} from "react-router-dom";

export default function ServiceInstance() {

    const [services, setServices] = useState(null)
    const [spinnerColor, setSpinnerColor] = useState("#1eb7ff")
    const [loading, setLoading] = useState(false);

    let routerPaths = useLocation().pathname.split("/")

    useEffect(() => {
        getServicesData(routerPaths[routerPaths.length - 2], routerPaths[routerPaths.length - 1]);
        let interval = setInterval(function () {
            getServicesData(routerPaths[routerPaths.length - 2], routerPaths[routerPaths.length - 1]);
        }, 5000);
        return() => {
            clearInterval(interval);
        }
    }, []);
    
    const getServicesData = (namespace, service) => {
        let sericeListURL = "/api/v1/services/" + namespace + "/" + service
        setLoading(true);
        api.get(sericeListURL).then((response) => {
            setServices(response.data.message.info)
            setLoading(false);
        }).catch((error) => {
            console.log(error)
            setServices(null)
            setLoading(false)
        })
    }

    //cell[0] - type:Initialized
    //cell[1] - type:Ready
    //cell[2] - type:ContainersReady
    //cell[3] - type:PodScheduled
    const getPodCondition = (item) => {
        let uniqueId = Math.floor(Math.random() * 100) + 1
        if (item[1].status == "True" && item[2].status == "True") {
            return { status: "success", condition: "Running", id: uniqueId }
        } else if (item[3].status == "False") {
            return { status: "warning", condition: "scheduling" , id: uniqueId}
        } else if (item[0].status == "True") {
            return { status: "danger", condition: "Stopped" , id: uniqueId }
        }
    }

    const sortCaret = (order) => {
        if (!order)
            return <i className="fa fa-fw fa-sort text-muted"></i>;
        if (order)
            return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>
    }

    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>Fetching service instances...</div>
            <div><PropagateLoader color="#1eb7ff" size={15} /></div>
        </div>
    );

    const columns = [
        {
            dataField: 'status.conditions',
            text: '#',
            sort: false,
            formatter: (cell) => {
                return (
                    <>
                        <i className={`fa fa -fw fa-circle text-${getPodCondition(cell).status}`}></i>
                    </>
                );
            }
        },
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
                return (
                    <>
                        {cell.map((item) => {
                            return (
                                <>
                                    <div id={item.name}
                                        style={{
                                            width:"10px",
                                            height:"10px", 
                                            borderRadius:"2px", 
                                            backgroundColor:item.ready ? "green" : "red", 
                                            display:"inline-block",
                                            margin:"0 2px"}}>
                                    </div>
                                    <UncontrolledTooltip 
                                        placement="top" 
                                        target={item.name}
                                    >
                                        {item.ready ? 
                                            <div style={{textAlign:"left"}}>
                                                <div>
                                                    <b>{item.name}</b>
                                                    <i>
                                                        ({Object.keys(item.state)[0]}, {item.started ? "Ready":"Not Ready"})
                                                    </i>
                                                </div>
                                                <div>Started At : {item.state[Object.keys(item.state)[0]].startedAt}</div>
                                            </div> 
                                        : ""}
                                    </UncontrolledTooltip> 
                                </>
                        )})}
                        
                    </>
                );
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
    ];

    return (

        <ToolkitProvider
            keyField="metadata.name"
            data={services}
            columns={columns}
            search
            exportCSV
        >
            {
                props => (
                    <React.Fragment>
                        <div>
                            <Breadcrumb>
                                <BreadcrumbItem>
                                    <Link to="/manage/services">services</Link>
                                </BreadcrumbItem>
                                <BreadcrumbItem>
                                    {routerPaths[routerPaths.length - 2]}
                                </BreadcrumbItem>
                                <BreadcrumbItem active>
                                    {routerPaths[routerPaths.length - 1]}
                                </BreadcrumbItem>
                            </Breadcrumb>
                        </div>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{ width: "300px" }}>
                                <CustomSearch
                                    className="mr-2" style={{ width: "auto !important" }}
                                    {...props.searchProps}
                                />
                            </div>
                        </div>
                        {services != null ? (
                            <BootstrapTable
                                classes="table-responsive-lg"
                                bordered={false}
                                responsive
                                hover
                                {...props.baseProps}
                            />
                        ) : loading ? <NoDataIndication />
                            : (<div style={{ textAlign: "center" }}> No Data Found </div>)}
                    </React.Fragment>
                )
            }
        </ToolkitProvider>
    )
}