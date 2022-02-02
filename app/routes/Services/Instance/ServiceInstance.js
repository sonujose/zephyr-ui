import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import {
    Breadcrumb,
    BreadcrumbItem,
    Nav,
    NavItem,
    NavLink,
} from './../../../components'
import PropagateLoader from "react-spinners/PropagateLoader";
import { ServiceMapSection } from './sections/servicemapSection'
import { ConfigurationSection } from './sections/configurationSection';
import { InstancesSection } from './sections/instanceSection';

import {
    useLocation,
    Link,
    useRouteMatch,
    Switch,
    Route,
    Redirect
} from "react-router-dom";

export default function ServiceInstance() {
    const { path, url } = useRouteMatch()
    let routerPaths = useLocation().pathname.split("/");

    const tab = (name) => {
        let locations = useLocation().pathname.split("/");
        return locations[locations.length - 1] == name;
    }

    return (
        <React.Fragment>
            <Breadcrumb style={{ paddingLeft: 0 }}>
                <BreadcrumbItem>
                    <Link to="/manage/services">services</Link>
                </BreadcrumbItem>
                <BreadcrumbItem>
                    {routerPaths[routerPaths.length - 3]}
                </BreadcrumbItem>
                <BreadcrumbItem active>
                    {routerPaths[routerPaths.length - 2]}
                </BreadcrumbItem>
            </Breadcrumb>

            <div className='col-md-6 mb-3' style={{ paddingLeft: 0 }}>
                <Nav pills className="nav-justified">
                    <NavItem>
                        <NavLink active={tab("instance")}>
                            <Link to={`${url}/instance`}>
                                Instances
                                <i className="fa fa-fw fa-cubes ml-2"></i>
                            </Link>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={tab("servicemap")}>
                            <Link to={`${url}/servicemap`}>
                                Service map
                                <i className="fa fa-fw fa-bullseye ml-2"></i>
                            </Link>
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink active={tab("configuration")}>
                            <Link to={`${url}/configuration`}>
                                Configuration
                                <i className="fa fa-fw fa-gears ml-2"></i>
                            </Link>
                        </NavLink>
                    </NavItem>
                </Nav>
            </div>
            <div className="tabs">
                <Switch>
                <Route exact path="/">
                    <Redirect to="/instance" />
                </Route>
                    <Route path={`${url}/instance`} render={() => <InstancesSection />} />
                    <Route path={`${url}/servicemap`} render={() => <ServiceMapSection />} />
                    <Route path={`${url}/configuration`} render={() => <ConfigurationSection />} />
                </Switch>
            </div>
        </React.Fragment>
    )
}