import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import moment from 'moment';
import _ from 'lodash';
import { api } from './../../api/fetcher'
import { UncontrolledTooltip } from './../../components'
import PropagateLoader from "react-spinners/PropagateLoader";
import Select from 'react-select'
import {
    PieChart,
    Pie,
    Cell,
    Radar, RadarChart, PolarGrid, Legend, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

import {
    Badge,
    Button,
    ButtonGroup,
    Row,
    Col
} from './../../components';
import { CustomSearch } from './components/CustomSearch';

export default function ServiceManager() {

    let userNamespacePreference = localStorage.getItem('service_namespace_preference')
    if (userNamespacePreference == null) {
        userNamespacePreference = "default"
    }

    const [services, setServices] = useState([])
    const [spinnerColor, setSpinnerColor] = useState("#1eb7ff")
    const [namespaces, setNamespaces] = useState([])
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState([]);
    const [preferedNamespace, setPreferedNamespace] = useState(userNamespacePreference)

    const getPodStatus = (podInfo) => {
        if (podInfo == null) {
            return "0"
        }
        let requestedPods = podInfo.length
        let runningPods = podInfo.filter((p) => p.isReady).length
        return runningPods.toString() + "/" + requestedPods.toString()
    }

    const getPodStatusPiChartData = (podInfo) => {

        if (podInfo == null) {
            return null
        }

        let requestedPods = podInfo.length
        let runningPods = podInfo.filter((p) => p.isReady).length

        return [
            { name: 'Running', value: (runningPods / requestedPods) * 100 },
            { name: 'Failed', value: (1 - (runningPods / requestedPods)) * 100 }
        ]
    };

    const resourceUsageRadarData = [
        {
            subject: 'Request',
            A: 120,
            B: 110,
            fullMark: 150,
        },
        {
            subject: 'Usage',
            A: 98,
            B: 130,
            fullMark: 150,
        },
        {
            subject: 'Limit',
            A: 86,
            B: 130,
            fullMark: 150,
        },
        {
            subject: 'Capacity',
            A: 99,
            B: 100,
            fullMark: 150,
        }
    ];

    useEffect(() => {

        // List all services in the namespace
        getServicesData(preferedNamespace);

        // Get List of all namespaces
        api.get("/api/v1/namespaces").then((response) => {
            let arr = response.data.message;
            let option = [...options];
            option.push({ value: "all-ns", label: "All Namespaces" })
            arr.map(elem => {
                var obj = { value: elem, label: elem };
                option.push(obj);
            })
            setOptions(option);
        }).catch((error) => {
            console.log(error)
        })

    }, []);

    const getServicesData = (param) => {
        setServices(null);
        let sericeListURL = "/api/v1/services/" + param
        setLoading(true);
        api.get(sericeListURL).then((response) => {
            setServices(response.data.message)
            setLoading(false);
        }).catch((error) => {
            console.log(error)
            setServices(null)
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
            <div className='mb-3'>Fetching services...</div>
            <div><PropagateLoader color={spinnerColor} size={15} /></div>
        </div>
    );

    const updateSelectedNamespace = (event) => {
        localStorage.setItem('service_namespace_preference', event.value);
        getServicesData(event.value);
    }

    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            sort: true,
            sortCaret,
            formatter: (cell) => {
                const gettrimmed = (input) => {
                    if (cell.length > 30) {
                        return input.substring(0, 30) + '...';
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
                if (cell != null) {
                    const readyNum = (podInfo) => {
                        let ready = podInfo?.filter((elem) => elem.isReady == true);
                        return ready;
                    }
                    return (
                        <>
                            <i class="fa fa-fw fa-arrow-circle-up green-color" aria-hidden="true"></i>{readyNum(cell).length}
                            <i class="fa fa-fw fa-arrow-circle-down red-color" aria-hidden="true"></i>{cell.length - readyNum(cell).length}
                        </>
                    );
                }
                else return (
                    <><span className='text-warning'>unscheduled</span></>
                );
            }
        },
        {
            dataField: 'labels',
            text: 'App',
            sort: true,
            formatter: (cell) => {
                if (cell != null) {
                    return cell["app.kubernetes.io/name"] || cell["kubernetes.io/name"] || cell["app"] || cell["k8s-app"];
                }
                else return ""
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
                <Col md={6}>
                    <span className='ml-3' style={{ fontWeight: "bold" }}>{row.name}</span>
                    <div className='d-flex justify-content-around mr-3'>
                        <div className="row ml-3" style={{ flexDirection: "column" }}>
                            <PieChart width={110} height={150} style={{ marginLeft: "32px" }}>
                                <text x={55} y={70} textAnchor="middle" dominantBaseline="middle">{getPodStatus(row.podInfo)}</text>
                                <text x={55} y={90} textAnchor="middle" dominantBaseline="middle">Instances</text>
                                <Pie
                                    data={getPodStatusPiChartData(row.podInfo)}
                                    dataKey="value"
                                    stroke="#foo"
                                    innerRadius={48}
                                    outerRadius={55}
                                    fill="#ccc"
                                >
                                    <Cell fill="#1EB7FF" />
                                </Pie>
                            </PieChart>
                            <div>
                                <div className="d-flex">
                                    <div className="text-left mr-3">
                                        <div className="small mb-2">
                                            <i className="fa fa-circle fa-fw text-primary"></i> Running &nbsp;
                                            <span className="mb-0">({row.podInfo.filter(p => p.isReady).length})</span>
                                        </div>
                                    </div>
                                    <div className="text-left">
                                        <div className="small mb-2">
                                            <i className="fa fa-circle fa-fw text-gray-300"></i> Requested &nbsp;
                                            <span className="mb-0">({row.podInfo.length})</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <ResponsiveContainer width='100%' aspect={1 / 1}>
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={resourceUsageRadarData}>
                                    <PolarGrid />
                                    <PolarAngleAxis dataKey="subject" />
                                    <PolarRadiusAxis angle={30} domain={[0, 150]} />
                                    <Radar name="CPU" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                                    <Radar name="Memory" dataKey="B" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>

                        </div>
                    </div>
                </Col>

                <Col md={6}>
                    <div className="row" style={{ flexDirection: "column" }}>
                        {/* Service Labels*/}
                        <div style={{ fontWeight: "bolder" }}>Selectors</div>
                        {row.selector !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {Object.entries(row.selector)?.map(([key, value]) => (
                                <div className='badge badge-secondary mr-2 mb-2'>{key}:{value.toString()}</div>
                            ))}
                        </div> : "No selectors found"}
                        {/* Service Labels*/}
                        <div style={{ fontWeight: "bolder" }}>Labels</div>
                        {row.labels !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {Object.entries(row.labels)?.map(([key, value]) => (
                                <div className='badge badge-primary mr-2 mb-2'>{key}:{value.toString()}</div>
                            ))}
                        </div> : "No lables found"}
                        {/* Service Annotations*/}
                        <div style={{ fontWeight: "bolder" }}>Annotations</div>
                        {row.annotations !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                            {Object.entries(row.annotations)?.map(([key, value]) =>
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
            keyField="name"
            data={services}
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
                                        <i className="fa fa-fw fa-plus"></i> Create Service
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                        {services != null ? (
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
                            : (<div style={{ textAlign: "center" }}> No Data Found </div>)}
                    </React.Fragment>
                )
            }
        </ToolkitProvider>
    )
}