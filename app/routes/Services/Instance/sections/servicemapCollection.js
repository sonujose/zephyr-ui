import React from 'react';
import {
    Badge,
    UncontrolledTooltip
} from '../../../../components';

export function getServicemapCollection(instances, ingress, service, selectors) {
    let mapCollection = []

    let serviceInstanceCollection = AddInstanceMappings(instances, service, selectors)
    let ingressMappings = AddIngressMappings(ingress, service)

    mapCollection = serviceInstanceCollection.concat(ingressMappings)
    return mapCollection
}

// AddInstaceMappings
// - Add Service and deployment nodes and create relation between both
// - Add all pods and creating relationship with deployment
function AddInstanceMappings(instances, service, selectors) {
    let serviceInstanceCollection = []

    // Step 1 - Add Service and deployment nodes and create relation between both
    serviceInstanceCollection.push({
        id: 'service',
        data: {
            label: (
                <>
                    <strong id="service">Service</strong>
                    <UncontrolledTooltip placement="top" target="service">
                        {service}
                    </UncontrolledTooltip>
                </>
            ),
        },
        position: { x: 100, y: 200 },
        style: {
            background: '#D6D5E6',
            color: '#333',
            border: '1px solid #222138',
            width: 200,
        },
    },
        {
            id: 'deployment',
            data: {
                label: (
                    <>
                        <strong id="deployment">Deployment</strong>
                        <UncontrolledTooltip placement="top" target="deployment">
                            {service}
                        </UncontrolledTooltip>
                    </>
                ),
            },
            position: { x: 100, y: 300 },
            style: {
                width: 200,
            }
        }, {
        id: 'service-deployment',
        source: 'service',
        target: 'deployment',
        arrowHeadType: 'arrowclosed',
        label: "selectors",
    })

    // Step 2 - Add all pods and creating relationship with deployment
    // - Add pods nodes
    // - Understand pod status and update same in the node added
    // - Add deployment relation if pod status is ready

    let xAxisBeginCorrection = Math.floor((instances.length - 1) / 2) * 200
    
    let podXAxis = 100 - xAxisBeginCorrection
    for (let index = 0; index < instances.length; index++) {

        // Assuming pod status to be true, if false will update new config
        let podready = true
        let podStatus = { condtion: "success", status: "ready", color: "#1BB934" }

        if (instances[index].status.containerStatuses == null) continue

        instances[index].status.containerStatuses.forEach(element => {
            if (element.ready == false) { podready = false }
        });

        if (!podready) {
            podStatus = { condtion: "danger", status: "down", color: "#ff0000" }
        }
        let podId = "pod" + index

        // Add the pod as a node along with the status
        serviceInstanceCollection.push({
            id: podId,
            type: 'output',
            data: {
                label: (
                    <>
                        <Badge color={podStatus.condtion}>
                            {podStatus.status}
                        </Badge>
                        <br />
                        <strong id={podId}>Pod</strong>
                        <UncontrolledTooltip placement="top" target={podId}>
                            {instances[index].metadata.name}
                        </UncontrolledTooltip>
                    </>
                ),
            },
            position: { x: podXAxis, y: 480 },
            style: {
                border: '1px solid #1BB934',
                borderColor: podStatus.color
            },
        })

        // Create Pod relationship with deployment if pod status is true
        if (podready) {
            serviceInstanceCollection.push({
                id: "deployment" + podId,
                source: 'deployment',
                target: podId,
                label: 'traffic',
                animated: true,
                labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
            })
        }
        podXAxis += 200
    }

    return serviceInstanceCollection
}

// AddIngressMappings
// - Add Ingress nodes to the tree
function AddIngressMappings(ingressList, service) {
    let ingressCollection = []

    let xAxisBeginCorrection = ((ingressList.length - 1) / 2) * 200
    let ingressXAxis = 100 - xAxisBeginCorrection
    let ingressYAxis = 0
    for (let index = 0; index < ingressList.length; index++) {
        let ingress = ingressList[index];
        let ingressId = "ingress" + index

        ingressCollection.push({
            id: ingressId,
            type: 'input',
            data: {
                label: (
                    <>
                        <strong id="ingress1">Ingress</strong>
                        <div>{ingress.ingressClass}</div>
                        <UncontrolledTooltip placement="top" target="ingress1">
                            {ingress.metadata.name}
                        </UncontrolledTooltip>
                    </>
                ),
            },
            position: { x: ingressXAxis, y: ingressYAxis },
            style: {
                width: 175,
            },
        }, {
            id: ingressId + "-service",
            source: ingressId,
            target: 'service',
            animated: true,
            label: ingress.spec.path,
            labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
        })
        ingressXAxis += 200
        index %2 == 0 ? ingressYAxis += 50 : ingressYAxis -= 50
    }
    return ingressCollection
}