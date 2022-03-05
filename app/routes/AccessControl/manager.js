import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { api } from './../../api/fetcher'
import PropagateLoader from "react-spinners/PropagateLoader";

export default function AccessControlManager() {

    const [environments, setEnvironments] = useState(null)
    const [loading, setLoading] = useState(false);

    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>Fetching Serviceaccount details...</div>
            <div><PropagateLoader color="#1eb7ff" size={15} /></div>
        </div>
    );

    useEffect(() => {
        getEnvironmentData();
        let interval = setInterval(function () {
            getEnvironmentData();
        }, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const getEnvironmentData = () => {
        let sericeListURL = "/api/v1/namespaces"
        setLoading(true);
        api.get(sericeListURL).then((response) => {
            setEnvironments(response.data.message)
            setLoading(false);
        }).catch((error) => {
            console.log(error)
            setEnvironments(null)
            setLoading(false)
        })
    }

    return (
        <>
            {environments != null ? (
                <div>
                    Cluster Access Control
                </div>
            ) : loading ? <NoDataIndication />
                : (<div style={{ textAlign: "center" }}> No Data Found </div>)}
        </>

    )
}