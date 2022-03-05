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
            icon={<i className="fa fa-fw fa-cube"></i>}
            title="Environment"
            to="/manage/environment"
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
            to="/manage/cost-analysis"
        />
           
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-shopping-bag"></i>}
            title="Marketplace"
            to="/manage/marketplace"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-lock"></i>}
            title="Access Control"
            to="/manage/access-control"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-eye"></i>}
            title="Auditing"
            to="/manage/auditing"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-bolt"></i>}
            title="Events"
            to="/manage/events"
        />
        <SidebarMenu.Item
            icon={<i className="fa fa-fw fa-gear"></i>}
            title="Settings"
            to="/manage/settings"
        />
    </SidebarMenu >
);
