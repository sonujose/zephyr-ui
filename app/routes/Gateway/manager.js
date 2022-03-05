import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import moment from 'moment';
import _ from 'lodash';
import { api } from './../../api/fetcher'
import { UncontrolledTooltip } from './../../components'
import PropagateLoader from "react-spinners/PropagateLoader";
import Select from 'react-select'
import { Link } from 'react-router-dom';

import {
    Badge,
    Button,
    ButtonGroup,
    Row,
    Col
} from './../../components';
import { CustomSearch } from './components/CustomSearch';

export default function GatewayManager() {

    let userNamespacePreference = localStorage.getItem('service_namespace_preference')
    if (userNamespacePreference == null) {
        userNamespacePreference = "default"
    }

    const [ingresses, setIngresses] = useState([])
    const [spinnerColor, setSpinnerColor] = useState("#1eb7ff")
    const [namespaces, setNamespaces] = useState([])
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [preferedNamespace, setPreferedNamespace] = useState(userNamespacePreference)

    useEffect(() => {

        // List all services in the namespace
        getIngressData(preferedNamespace);

        // Get List of all namespaces
        api.get("/api/v1/namespaces").then((response) => {
            let arr = response.data.message;
            let option = [...options];
            //option.push({ value: "all-ns", label: "All Namespaces" })
            arr.map(elem => {
                var obj = { value: elem, label: elem };
                option.push(obj);
            })
            setOptions(option);
        }).catch((error) => {
            console.log(error)
        })

    }, []);

    const getIngressData = (namespace) => {
        setIngresses(null);
        let sericeListURL = "/api/v1/ingress/" + namespace
        setLoading(true);
        api.get(sericeListURL).then((response) => {
            setIngresses(response.data.message)
            setLoading(false);
        }).catch((error) => {
            console.log(error)
            setIngresses(null)
            setLoading(false)
        })
    }

    const sortCaret = (order) => {
        if (!order)
            return <i className="fa fa-fw fa-sort text-muted"></i>;
        if (order)
            return <i className={`fa fa-fw text-muted fa-sort-${order}`}></i>
    }

    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>Fetching Gateway routes...</div>
            <div><PropagateLoader color={spinnerColor} size={15} /></div>
        </div>
    );

    const updateSelectedNamespace = (event) => {
        setPreferedNamespace(event.value)
        localStorage.setItem('service_namespace_preference', event.value);
        getIngressData(event.value);
    }

    const columns = [
        {
            dataField: 'metadata.name',
            text: 'Name',
            sort: true,
            sortCaret
        },
        {
            dataField: 'metadata.annotations',
            text: 'Gateway',
            sort: true,
            formatter: (cell) => {
                if (cell != null) {
                    return cell["kubernetes.io/ingress.class"] || "unknown";
                }
                else return ""
            }
        },{
            dataField: 'status.loadBalancer',
            text: 'Status',
            sort: true,
            formatter: (cell) => {
                return (
                    <Badge color={'success'}>
                        Live
                    </Badge>
                );
            }
        }, 
        {
            dataField: 'status.loadBalancer.ingress',
            text: 'Internal IP',
            sort: true,
            sortCaret,
            formatter: (cell) => {
                return cell[0].ip
            }
        },

        {
            dataField: 'metadata.namespace',
            text: 'Namespace',
            sort: true,
            sortCaret
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

    const expandRow = {
        renderer: row => (
            <Row>
                <col md={2}></col>
                <Col md={6}>
                    <div className="row" style={{ flexDirection: "column" }}>
                        {/* Ingress Labels*/}
                        <div style={{ fontWeight: "bolder" }}>Labels</div>
                        {row.metadata.labels !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {Object.entries(row.metadata.labels)?.map(([key, value]) => (
                                <div className='badge badge-primary mr-2 mb-2'>{key}:{value.toString()}</div>
                            ))}
                        </div> : "No lables found"}
                        {/* Ingress Annotations*/}
                        <div style={{ fontWeight: "bolder" }}>Annotations</div>
                        {row.metadata.annotations !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {Object.entries(row.metadata.annotations)?.map(([key, value]) =>
                                (key !== "kubectl.kubernetes.io/last-applied-configuration")
                                    ? <div className='badge badge-info mr-2 mb-2'>{key}:{value.toString()}</div>
                                    : <div className='badge badge-info mr-2 mb-2'>{key}</div>
                            )}
                        </div> : "No annotations found"}

                    </div>
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
            keyField="metadata.name"
            data={ingresses}
            columns={columns}
            search
            exportCSV
        >
            {
                props => (
                    <React.Fragment>

                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div style={{ width: "300px" }}>
                                <CustomSearch
                                    className="mr-2" style={{ width: "auto !important" }}
                                    {...props.searchProps}
                                />
                            </div>
                            <div className="d-flex ml-auto" >
                                <ButtonGroup>
                                    <div className='mr-2' style={{ width: "200px" }}>
                                        <Select
                                            defaultValue={{ value: preferedNamespace, label: preferedNamespace }}
                                            options={options}
                                            isDisabled={loading}
                                            onChange={updateSelectedNamespace}
                                            isSearchable="true" />
                                    </div>
                                    <Button
                                        size="sm"
                                        color='primary'
                                    // onClick={handleAddRow}
                                    >
                                        <i className="fa fa-fw fa-plus"></i> Create Route
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        {ingresses != null ? (
                            <BootstrapTable
                                classes="table-responsive-lg"
                                bordered={false}
                                expandRow={expandRow}
                                // noDataIndication={() => <NoDataIndication />}
                                responsive
                                hover
                                {...props.baseProps}
                            />
                        ) : loading ? <NoDataIndication />
                            : (<div style={{ textAlign: "center" }}> No Routes Found </div>)}
                    </React.Fragment>
                )
            }
        </ToolkitProvider>
    )
}