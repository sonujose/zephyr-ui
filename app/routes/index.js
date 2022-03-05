import React from 'react';
import {
    Route,
    Switch,
    Redirect
} from 'react-router';

// ----------- Pages Imports ---------------
import Analytics from './Dashboards/Analytics';
import ProjectsDashboard from './Dashboards/Projects';
import System from './Dashboards/System';
import Monitor from './Dashboards/Monitor'; 
import Financial from './Dashboards/Financial';
import Stock from './Dashboards/Stock';
import Reports from './Dashboards/Reports';

import NavbarOnly from './Layouts/NavbarOnly';
import SidebarWithNavbar from './Layouts/SidebarWithNavbar';

import ServiceManager from './Services/manager';
import ServiceInstance from './Services/Instance';
import GatewayManager from './Gateway';
import EnvironmentManager from './Environment';
import MarketplaceManager from './marketplace';
import AccessControlManager from './AccessControl';
import CostAnalysisManager from './CostAnalysis';
import AuditingManager from './Auditing';
import SettingsManager from './Settings';
import EventsManager from './Events';
import ComingSoon from './Pages/ComingSoon';
import Confirmation from './Pages/Confirmation';
import Danger from './Pages/Danger';
import Error404 from './Pages/Error404';
import ForgotPassword from './Pages/ForgotPassword';
import LockScreen from './Pages/LockScreen';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Success from './Pages/Success';
import Timeline from './Pages/Timeline';

import Icons from './Icons';

// ----------- Layout Imports ---------------
import { DefaultNavbar } from './../layout/components/DefaultNavbar';
import { DefaultSidebar } from './../layout/components/DefaultSidebar';

import { SidebarANavbar } from './../layout/components/SidebarANavbar';
import { SidebarASidebar } from './../layout/components/SidebarASidebar';

//------ Route Definitions --------
// eslint-disable-next-line no-unused-vars
export const RoutedContent = () => {
    return (
        <Switch>
            <Redirect from="/" to="/manage/services" exact />
            
            <Route path="/dashboards/analytics" exact component={Analytics} />
            <Route path="/dashboards/projects" exact component={ProjectsDashboard} />
            <Route path="/dashboards/system" exact component={System} />
            <Route path="/dashboards/monitor" exact component={Monitor} />
            <Route path="/dashboards/financial" exact component={Financial} />
            <Route path="/dashboards/stock" exact component={Stock} />
            <Route path="/dashboards/reports" exact component={Reports} />

            <Route component={ ServiceManager } exact path="/manage/services" />
            <Route component={ ServiceInstance } path="/manage/services/:namespace/:service" />

            <Route component={ GatewayManager } path="/manage/gateway" />
            <Route component={ EnvironmentManager } path="/manage/environment" />
            <Route component={ MarketplaceManager } path="/manage/marketplace" />
            <Route component={ AccessControlManager } path="/manage/access-control" />
            <Route component={ CostAnalysisManager } path="/manage/cost-analysis" />
            <Route component={ AuditingManager } path="/manage/auditing" />
            <Route component={ SettingsManager } path="/manage/settings" />
            <Route component={ EventsManager } path="/manage/events" />

            <Route component={ ComingSoon } path="/pages/coming-soon" />
            <Route component={ Confirmation } path="/pages/confirmation" />
            <Route component={ Danger } path="/pages/danger" />
            <Route component={ Error404 } path="/pages/error-404" />
            <Route component={ ForgotPassword } path="/pages/forgot-password" />
            <Route component={ LockScreen } path="/pages/lock-screen" />
            <Route component={ Login } path="/pages/login" />
            <Route component={ Register } path="/pages/register" />
            <Route component={ Success } path="/pages/success" />
            <Route component={ Timeline } path="/pages/timeline" />

            <Route path='/icons' exact component={Icons} />

            { /*    404    */ }
            <Redirect to="/pages/error-404" />
        </Switch>
    );
};

//------ Custom Layout Parts --------
export const RoutedNavbars  = () => (
    <Switch>
        { /* Other Navbars: */}
        <Route
            component={ SidebarANavbar }
            path="/layouts/sidebar-a"
        />
        <Route
            component={ NavbarOnly.Navbar }
            path="/layouts/navbar"
        />
        <Route
            component={ SidebarWithNavbar.Navbar }
            path="/layouts/sidebar-with-navbar"
        />
        { /* Default Navbar: */}
        <Route
            component={ DefaultNavbar }
        />
    </Switch>  
);

export const RoutedSidebars = () => (
    <Switch>
        { /* Other Sidebars: */}
        <Route
            component={ SidebarASidebar }
            path="/layouts/sidebar-a"
        />
        <Route
            component={ SidebarWithNavbar.Sidebar }
            path="/layouts/sidebar-with-navbar"
        />
        { /* Default Sidebar: */}
        <Route
            component={ DefaultSidebar }
        />
    </Switch>
);
