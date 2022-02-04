import React, { useEffect, useState } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import _ from 'lodash';
import { api } from './../../../../api/fetcher'
import PropagateLoader from "react-spinners/PropagateLoader";
import { getServiceInstanceColumns } from '../components/instanceColumns';
import { CustomSearch } from '../components/CustomSearch';

import {
    useLocation
} from "react-router-dom";

export function InstancesSection() {

    const [services, setServices] = useState(null)
    const [loading, setLoading] = useState(false);
    let routerPaths = useLocation().pathname.split("/");

    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>Fetching service instances...</div>
            <div><PropagateLoader color="#1eb7ff" size={15} /></div>
        </div>
    );

    useEffect(() => {
        getServicesData(routerPaths[routerPaths.length - 3], routerPaths[routerPaths.length - 2]);
        let interval = setInterval(function () {
            getServicesData(routerPaths[routerPaths.length - 3], routerPaths[routerPaths.length - 2]);
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
                    <>
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
                                selectRow={ { mode: 'checkbox', clickToSelect: false } }
                                {...props.baseProps}
                            />
                        ) : loading ? <NoDataIndication />
                            : (<div style={{ textAlign: "center" }}> No Data Found </div>)}
                    </>
                )
            }
        </ToolkitProvider>
    )
}