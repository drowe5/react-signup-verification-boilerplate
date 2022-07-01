import React from 'react';
import { Link } from 'react-router-dom';

function ProjectTargets({ match }) {
    const { path } = match;

    return (
        <div>
            <h1>Harvest</h1>
            <p>This section can only be accessed by administrators.</p>
            <p><Link to={`${path}/users`}>Manage Users</Link></p>
        </div>
    );
}

export { ProjectTargets };