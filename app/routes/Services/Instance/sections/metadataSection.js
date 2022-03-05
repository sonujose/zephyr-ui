import React, { useEffect, useState } from 'react';
import {
    useLocation
} from "react-router-dom";
import { api } from './../../../../api/fetcher'
import {
    Row,
    Col
} from './../../../../components';
import PropagateLoader from "react-spinners/PropagateLoader";

export function MetadataSection() {

    const [metadata, setMetadata] = useState(null)
    const [selectors, setSelectors] = useState(null)
    const [loading, setLoading] = useState(false);
    let routerPaths = useLocation().pathname.split("/");

    const getMetadataInfo = (namespace, service) => {
        let sericeListURL = "/api/v1/services/" + namespace + "/" + service
        setLoading(true);
        api.get(sericeListURL).then((response) => {
            setMetadata(response.data.message.info[0].metadata)
            setSelectors(response.data.message.selectors)
            setLoading(false);
        }).catch((error) => {
            console.log(error)
            setMetadata(null)
            setSelectors(null)
            setLoading(false)
        })
    }
    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>Fetching service metadata...</div>
            <div><PropagateLoader color="#1eb7ff" size={15} /></div>
        </div>
    );

    useEffect(() => {
        getMetadataInfo(routerPaths[routerPaths.length - 3], routerPaths[routerPaths.length - 2]);
    }, []);
    return (
        <>
            {(metadata != null && selectors != null) ? (
                <Row>
                    <Col md={12}>
                        <div className="row" style={{ flexDirection: "column" }}>
                            {/* Service Labels*/}
                            <div style={{ fontWeight: "bolder" }}>Selectors</div>
                            {selectors !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {Object.entries(selectors)?.map(([key, value]) => (
                                    <div className='badge badge-secondary mr-2 mb-2'>{key}:{value.toString()}</div>
                                ))}
                            </div> : "No selectors found"}
                            {/* Service Labels*/}
                            <div style={{ fontWeight: "bolder" }}>Labels</div>
                            {metadata.labels !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {Object.entries(metadata.labels)?.map(([key, value]) => (
                                    <div className='badge badge-primary mr-2 mb-2'>{key}:{value.toString()}</div>
                                ))}
                            </div> : "No lables found"}
                            {/* Service Annotations*/}
                            <div style={{ fontWeight: "bolder" }}>Annotations</div>
                            {metadata.annotations !== null ? <div style={{ display: "flex", flexWrap: "wrap" }}>
                                {Object.entries(metadata.annotations)?.map(([key, value]) =>
                                    (key !== "kubectl.kubernetes.io/last-applied-configuration")
                                        ? <div className='badge badge-info mr-2 mb-2'>{key}:{value.toString()}</div>
                                        : <div className='badge badge-info mr-2 mb-2'>{key}</div>
                                )}
                            </div> : "No annotations found"}

                        </div>
                    </Col>
                </Row>
            ) : loading ? <NoDataIndication />
                : (<div style={{ textAlign: "center" }}> No Data Found </div>)}


        </>
    )
}