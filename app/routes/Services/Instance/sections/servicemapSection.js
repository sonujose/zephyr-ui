import React, { useState, useEffect } from 'react';
import { api } from './../../../../api/fetcher'
import ReactFlow, {
    removeElements,
    addEdge,
    MiniMap,
    Controls,
    Background,
} from 'react-flow-renderer';
import PropagateLoader from "react-spinners/PropagateLoader";
import { servicemapCollection, getServicemapCollection } from './servicemapCollection';
import {
    useLocation
} from "react-router-dom";

const onLoad = (reactFlowInstance) => {
    console.log('flow loaded:', reactFlowInstance);
    reactFlowInstance.fitView();
};

export function ServiceMapSection() {

    const [elements, setElements] = useState([]);
    const [services, setServices] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState("loading...");

    const onElementsRemove = (elementsToRemove) =>
        setElements((els) => removeElements(elementsToRemove, els));
    const onConnect = (params) => setElements((els) => addEdge(params, els));
    let routerPaths = useLocation().pathname.split("/");

    const NoDataIndication = () => (
        <div className='mt-6' style={{ textAlign: "center", height: "100px", marginTop: "100px" }}>
            <div className='mb-3'>{loadingText}</div>
            <div><PropagateLoader color="#1eb7ff" size={15} /></div>
        </div>
    );

    useEffect(() => {
        getAllMappingData()
        let interval = setInterval(function () {
            getAllMappingData()
        }, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const getAllMappingData = () => {
        let service = routerPaths[routerPaths.length - 3]
        let namespace = routerPaths[routerPaths.length - 2]
        const promise1 = getServicesData(service, namespace);
        const promise2 = getIngressMappingData(service, namespace);
        Promise.all([promise1, promise2]).then(function (values) {
            console.log("All promises returned.");
            setLoading(false);
            setServices(values[0].data.message.info)
            setElements(getServicemapCollection(values[0].data.message.info, service, values[0].data.message.selectors))
        }).catch((error) => {
            console.log("Promise failed" + error.message);
            setLoading(false);
        });
    }
    const getServicesData = (namespace, service) => {
        let sericeListURL = "/api/v1/services/" + namespace + "/" + service
        setLoading(true);
        setLoadingText("Generating servicemap visualization...")
        return api.get(sericeListURL)
    }

    const getIngressMappingData = (namespace, service) => {
        let ingressMappingURL = "/api/v1/services/mappings/ingress/" + namespace + "/" + service
        setLoading(true);
        setLoadingText("Mapping Ingress details to servicemap...")
        return api.get(ingressMappingURL)
    }

    return (
        <div style={{ height: "70vh" }}>
            {services != null ? (
                <ReactFlow
                    elements={elements}
                    onElementsRemove={onElementsRemove}
                    onConnect={onConnect}
                    onLoad={onLoad}
                    snapToGrid={true}
                    snapGrid={[15, 15]}
                >
                    <MiniMap
                        nodeStrokeColor={(n) => {
                            if (n.style?.background) return n.style.background;
                            if (n.type === 'input') return '#0041d0';
                            if (n.type === 'output') return '#ff0072';
                            if (n.type === 'default') return '#1a192b';

                            return '#eee';
                        }}
                        nodeColor={(n) => {
                            if (n.style?.background) return n.style.background;

                            return '#fff';
                        }}
                        nodeBorderRadius={2}
                    />
                    <Controls />
                    <Background color="#aaa" gap={16} />
                </ReactFlow>
            ) : loading ? <NoDataIndication />
                : (<div style={{ textAlign: "center" }}> No Data Found </div>)}

        </div>

    );
};