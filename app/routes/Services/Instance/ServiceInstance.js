import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import _ from 'lodash';
import { api } from './../../../api/fetcher'
import {
    Breadcrumb,
    BreadcrumbItem,
    Nav,
    NavItem,
    NavLink,
} from './../../../components'
import PropagateLoader from "react-spinners/PropagateLoader";
import { getServiceInstanceColumns } from './components/instanceColumns';
import { CustomSearch } from './components/CustomSearch';

import {
    useLocation,
    Link
} from "react-router-dom";

export default function ServiceInstance() {

    const [services, setServices] = useState(null)
    const [loading, setLoading] = useState(false);

    let routerPaths = useLocation().pathname.split("/")

    useEffect(() => {
        getServicesData(routerPaths[routerPaths.length - 2], routerPaths[routerPaths.length - 1]);
        let interval = setInterval(function () {
            getServicesData(routerPaths[routerPaths.length - 2], routerPaths[routerPaths.length - 1]);
        }, 5000);
        return () => {
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

    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>Fetching service instances...</div>
            <div><PropagateLoader color="#1eb7ff" size={15} /></div>
        </div>
    );

    return (

        <ToolkitProvider
            keyField="metadata.name"
            data={services}
            columns={getServiceInstanceColumns()}
            search
            exportCSV
        >
            {
                props => (
                    <React.Fragment>
                        <div>
                            <Breadcrumb style={{paddingLeft: 0}}>
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

                        <div className='col-md-6 mb-3' style={{paddingLeft: 0}}>
                            <Nav pills className="nav-justified">
                                <NavItem>
                                    <NavLink href="#" active>
                                        <i className="fa fa-fw fa-cubes mr-2"></i>
                                        Instances
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="#">
                                        Service map
                                        <i className="fa fa-fw fa-bullseye ml-2"></i>
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink href="#">
                                        Configuration
                                        <i className="fa fa-fw fa-gears ml-2"></i>
                                    </NavLink>
                                </NavItem>
                            </Nav>
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