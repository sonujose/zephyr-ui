import React from 'react';
import { Link } from 'react-router-dom';
import faker from 'faker/locale/en_US';
import _ from 'lodash';
import PropTypes from 'prop-types';

import {
    UncontrolledDropdown,
    DropdownToggle,
    IconWithBadge,
    Badge,
    ExtendedDropdown,
    ListGroup,
    ListGroupItem,
    Media
} from './../../components';

/*eslint-disable */
const activityFeedIcons = [
    <span className="fa-stack fa-lg fa-fw d-flex mr-3">
        <i className="fa fa-circle fa-fw fa-stack-2x text-success"></i>
        <i className="fa fa-check fa-stack-1x fa-fw text-white"></i>
    </span>,
    <span className="fa-stack fa-lg fa-fw d-flex mr-3">
        <i className="fa fa-circle fa-fw fa-stack-2x text-danger"></i>
        <i className="fa fa-close fa-stack-1x fa-fw text-white"></i>
    </span>,
    <span className="fa-stack fa-lg fa-fw d-flex mr-3">
        <i className="fa fa-circle fa-fw fa-stack-2x text-warning"></i>
        <i className="fa fa-exclamation fa-stack-1x fa-fw text-white"></i>
    </span>,
    <span className="fa-stack fa-lg fa-fw d-flex mr-3">
        <i className="fa fa-circle fa-fw fa-stack-2x text-primary"></i>
        <i className="fa fa-info fa-stack-1x fa-fw text-white"></i>
    </span>
];
/*eslint-enable */

const NavbarActivityFeed = (props) => (
    <UncontrolledDropdown nav inNavbar { ...props }>
        
    </UncontrolledDropdown>
);
NavbarActivityFeed.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

export { NavbarActivityFeed };
