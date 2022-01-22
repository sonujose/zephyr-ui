import React from 'react';
import { Container, Row, Col } from './../../../components';

import ServiceManager from './components/ServiceManager';
import {AdvancedTableB} from './components/AdvancedTableB';
import { HeaderMain } from "../../components/HeaderMain";

export const ExtendedTable = () => (
    <Container>
        <HeaderMain 
            title="Services"
            className="mb-4 mt-1"
        />
        <Row className="mb-5">
            <Col>
                <ServiceManager/>
                {/* <AdvancedTableB /> */}
            </Col>
        </Row>
    </Container>
);
