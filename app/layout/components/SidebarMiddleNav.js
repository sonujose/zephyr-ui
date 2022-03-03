import React from 'react';

import { SidebarMenu } from './../../components';

export const SidebarMiddleNav = () => (
    <SidebarMenu>
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-home"></i>}
            title="Cluster"
        >
            {/* <SidebarMenu.Item title="Overview" to='/dashboards/analytics' exact />
            <SidebarMenu.Item title="Projects" to='/dashboards/projects' exact /> */}
            <SidebarMenu.Item title="System" to='/dashboards/system' exact />
            <SidebarMenu.Item title="Monitor" to='/dashboards/monitor' exact />
            {/* <SidebarMenu.Item title="Financial" to='/dashboards/financial' exact />
            <SidebarMenu.Item title="Stock" to='/dashboards/stock' exact />
            <SidebarMenu.Item title="Reports" to='/dashboards/reports' exact /> */}
        </SidebarMenu.Item>
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-cubes"></i>}
            title="Environment"
            to="/manage/gateway"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-th"></i>}
            title="Services"
            to="/manage/services"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-compass"></i>}
            title="Gateway"
            to="/manage/gateway"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-dollar"></i>}
            title="Cost Analysis"
        >
            <SidebarMenu.Item title="Cluster" to='/dashboards/system' exact />
            <SidebarMenu.Item title="Services" to='/dashboards/system' exact />
            </SidebarMenu.Item>
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-shopping-bag"></i>}
            title="Marketplace"
            to="/manage/gateway"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-lock"></i>}
            title="Access Control"
            to="/manage/gateway"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-bar-chart-o"></i>}
            title="Audit"
            to="/manage/gateway"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-bolt"></i>}
            title="Events"
            to="/manage/gateway"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-gear"></i>}
            title="Settings"
            to="/manage/gateway"
        />
    </SidebarMenu >
);
