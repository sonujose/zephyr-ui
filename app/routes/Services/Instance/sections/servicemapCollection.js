import React from 'react';
import {
    Badge,
    UncontrolledTooltip
} from '../../../../components';

export function getServicemapCollection(instances, service) {
    
}

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
        id: 'e1-3',
        source: 'ingress1',
        target: 'service',
        animated: true,
        label: '/api/asset/asset-service/v1',
    },
    {
        id: 'e4-5',
        source: 'service',
        target: 'deployment',
        arrowHeadType: 'arrowclosed',
        label: 'service selector',
    },
    {
        id: 'e5-6',
        source: 'deployment',
        target: 'pod1',
        label: 'traffic',
        animated: true,
        labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
    },
    {
        id: 'e5-7',
        source: 'deployment',
        target: 'pod2',
        label: 'traffic',
        animated: true,
        labelStyle: { fill: '#f6ab6c', fontWeight: 700 },
    },
];