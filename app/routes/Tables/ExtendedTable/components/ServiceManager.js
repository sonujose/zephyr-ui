import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import moment from 'moment';
import _ from 'lodash';
import faker from 'faker/locale/en_US';
import { api } from './../../../../api/fetcher'
import { UncontrolledTooltip } from './../../../../components'

import {
    Avatar,
    Badge,
    Button,
    ButtonGroup,
    Row,
    Col
} from './../../../../components';
import { CustomExportCSV } from './CustomExportButton';
import { CustomSearch } from './CustomSearch';
import { randomArray, randomAvatar } from './../../../../utilities';





export default function ServiceManager() {
    const [services, setServices] = useState([])

    useEffect(() => {
        api.get("/api/v1/services/am-dev").then((response) => {
            setServices(response.data.data)
        }).catch((error) => {
            console.log(error)
        })

    }, []);

    const generateRow = (id) => ({
        name: services.name,
        namespace: services.namespace,
        ipAddress: services.clusterIP,
        // extAddress:services.labels["app.kubernetes.io/name"]
        // extAddress: services."",
        // status: randomArray([
        //     'Active',
        //     'Suspended',
        //     'Waiting',
        //     'Unknown'
        // ])
    });

    const sortCaret = (order) => {
        if (!order)
            return <i className="fa fa-fw fa-sort text-muted"></i>;
        if (order)
            return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>
    }

    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            sortCaret,
            formatter: (cell) => {
                const gettrimmed = (input) => {
                    if (cell.length > 40) {
                        return input.substring(0, 40) + '...';
                     } else {
                         return cell
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
            dataField: 'podInfo',
            text: 'Instances',
            sort: false,
            sortCaret,
            formatter: (cell) => {
                const readyNum = (podInfo) => {
                    let ready = podInfo.filter((elem) => elem.isReady == true);
                    return ready;
                }
                return (
                    <>
                        <i class="fa fa-fw fa-arrow-up green-color" aria-hidden="true"></i>{readyNum(cell).length}
                        <i class="fa fa-fw fa-arrow-down red-color" aria-hidden="true"></i>{cell.length - readyNum(cell).length}
                    </>
                );
            }
        },
        {
            dataField: 'labels',
            text: 'App',
            sort: true,
            formatter: (cell) => {
                return cell["app.kubernetes.io/name"];
            }
        }, {
            dataField: 'namespace',
            text: 'Namespace',
            sort: true,
            sortCaret
        },
        {
            dataField: 'state',
            text: 'Status',
            sort: true,
            formatter: (cell) => {
                const color = (status) => {
                    const map = {
                        'Active': 'success',
                        'Failed': 'danger',
                        'Waiting': 'info',
                        'Unknown': 'secondary'
                    };
                    return map[status];
                }

                return (
                    <Badge color={color(cell)}>
                        {cell}
                    </Badge>
                );
            }
        },
        {
            dataField: 'clusterIP',
            text: 'Internal IP',
            sort: false
        },
        {
            dataField: 'creationTimestamp',
            text: 'Created',
            sort: false,
            formatter: (cell) => {
                return (
                    <span>{moment(cell).fromNow()}</span>
                )
            }
        },
    ];

    const expandRow = {
        renderer: row => (
            <Row>
                <Col md={6}>
                    <dl className="row">
                        <dt className="col-sm-6 text-right">Cluster IP</dt>
                        <dd className="col-sm-6">{row.clusterIP}</dd>

                        <dt className="col-sm-6 text-right">IP Address</dt>
                        <dd className="col-sm-6">{row.ipAddress}</dd>

                        <dt className="col-sm-6 text-right">Browser</dt>
                        <dd className="col-sm-6">{row.browser}</dd>
                    </dl>
                </Col>
                <Col md={6}>
                    <dl className="row">
                        <dt className="col-sm-6 text-right">Operating System</dt>
                        <dd className="col-sm-6">{row.os}</dd>

                        <dt className="col-sm-6 text-right">Selected Plan</dt>
                        <dd className="col-sm-6">{row.planSelected}</dd>

                        <dt className="col-sm-6 text-right">Plan Expiriation</dt>
                        <dd className="col-sm-6">{moment(row.planEnd).format('DD-MMM-YYYY')}</dd>
                    </dl>
                </Col>
            </Row>
        ),
        showExpandColumn: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => isAnyExpands ? (
            <i className="fa fa-angle-down fa-fw fa-lg text-muted"></i>
        ) : (
            <i className="fa fa-angle-right fa-fw fa-lg text-muted"></i>
        ),
        expandColumnRenderer: ({ expanded }) =>
            expanded ? (
                <i className="fa fa-angle-down fa-fw fa-lg text-muted"></i>
            ) : (
                <i className="fa fa-angle-right fa-fw fa-lg text-muted"></i>
            )
    }

    return (
        <ToolkitProvider
            keyField="name"
            data={services}
            columns={columns}
            search
            exportCSV
        >
            {
                props => (
                    <React.Fragment>
                        <div className="d-flex justify-content-end align-items-center mb-2">
                            <h6 className="my-0">
                                Applications
                            </h6>
                            <div className="d-flex ml-auto">
                                <CustomSearch
                                    className="mr-2"
                                    { ...props.searchProps }
                                />
                                <ButtonGroup>
                                    <Button
                                        size="sm"
                                        color='primary'
                                        // onClick={handleAddRow}
                                    >
                                        <i className="fa fa-fw fa-plus"></i> Create Service
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        <BootstrapTable
                            classes="table-responsive-lg"
                            bordered={ false }
                            expandRow={ expandRow }
                            responsive
                            hover
                            { ...props.baseProps }
                        />
                    </React.Fragment>
                )
            }
        </ToolkitProvider>


    );
}