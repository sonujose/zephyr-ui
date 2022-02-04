import React from 'react';
import {
    Badge,
    UncontrolledTooltip
} from '../../../../components';

export function getServicemapCollection(instances, service) {
    let mapCollection = []

    // Step 1 - Add Service and deployment nodes and create relation between both
    mapCollection.push({
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
        position: { x: 100, y: 100 },
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
        position: { x: 100, y: 225 },
        style: {
            width: 200,
        }
    },{
        id: 'service-deployment',
        source: 'service',
        target: 'deployment',
        arrowHeadType: 'arrowclosed',
        label: 'service selector',
    })

    // Step 2 - Add Ingress nodes to the tree
    // TODO: Handle scenerio where a service has multiple ingress and multiple paths
    mapCollection.push({
        id: 'ingress1',
        type: 'input',
        data: {
            label: (
                <>
                    <strong id="ingress1">Ingress</strong>
                    <UncontrolledTooltip placement="top" target="ingress1">
                        {service}
                    </UncontrolledTooltip>
                </>
            ),
        },
        position: { x: 100, y: 0 },
        style: {
            width: 200,
        },
    })

    // Step 3 - Create  relation b/w ingress nodes and upstream service
    mapCollection.push({
        id: 'ingress1-service',
        source: 'ingress1',
        target: 'service',
        animated: true,
        label: '/api/asset/asset-service/v1',
    })

    
    // Step 4 - Add all pods and creating relationship with deployment
    // - Add pods nodes
    // - Understand pod status and update same in the node added
    // - Add deployment relation if pod status is ready

    let xAxisBeginCorrection = instances.length/2*200
    let podXAxis = 120 - xAxisBeginCorrection
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
        mapCollection.push({
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
            mapCollection.push({
                id: "deployment" + podId,
                source: 'deployment',
                target: podId,
                label: 'traffic',
                animated: true,
                labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
            })
        }
        podXAxis+=200
    }

    return mapCollection
}

// Example route
export const servicemapCollection = [
    {
        id: 'ingress1',
        type: 'input',
        data: {
            label: (
                <>
                    <strong id="ingress1">Ingress</strong>
                    <UncontrolledTooltip placement="top" target="ingress1">
                        assetreferencedata-microservice-rel-referencedata-v1-100
                    </UncontrolledTooltip>
                </>
            ),
        },
        position: { x: 100, y: 0 },
        style: {
            width: 200,
        },
    },
    {
        id: 'service',
        data: {
            label: (
                <>
                    <strong id="service">Service</strong>
                    <UncontrolledTooltip placement="top" target="service">
                        assetreferencedata-microservice-rel-referencedata-v1-100
                    </UncontrolledTooltip>
                </>
            ),
        },
        position: { x: 100, y: 100 },
        style: {
            background: '#D6D5E6',
            color: '#333',
            border: '1px solid #222138',
            width: 200,
        },
    },
    {
        id: 'ingress1-service',
        source: 'ingress1',
        target: 'service',
        animated: true,
        label: '/api/asset/asset-service/v1',
    },
    {
        id: 'deployment',
        data: {
            label: (
                <>
                    <strong id="deployment">Deployment</strong>
                    <UncontrolledTooltip placement="top" target="deployment">
                        assetreferencedata-microservice-rel-referencedata-v1-100
                    </UncontrolledTooltip>
                </>
            ),
        },
        position: { x: 100, y: 225 },
        style: {
            width: 200,
        },
    },
    {
        id: 'pod1',
        type: 'output',
        data: {
            label: (
                <>
                    <Badge color="success">
                        Ready
                    </Badge>
                    <br />
                    <strong>Pod</strong>
                </>
            ),
        },
        position: { x: 100, y: 480 },
        style: {
            border: '1px solid #1BB934',
        },
    },
    {
        id: 'pod2',
        type: 'output',
        data: {
            label: (
                <>
                    <Badge color="success">
                        Ready
                    </Badge>
                    <br />
                    <strong>Pod</strong>
                </>
            ),
        },
        position: { x: 400, y: 480 },
        style: {
            border: '1px solid #1BB934',
        },
    },

    {
        id: 'service-deployment',
        source: 'service',
        target: 'deployment',
        arrowHeadType: 'arrowclosed',
        label: 'service selector',
    },
    {
        id: 'deployment-pod1',
        source: 'deployment',
        target: 'pod1',
        label: 'traffic',
        animated: true,
        labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
    },
    {
        id: 'deployment-pod2',
        source: 'deployment',
        target: 'pod2',
        label: 'traffic',
        animated: true,
        labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
    },
];