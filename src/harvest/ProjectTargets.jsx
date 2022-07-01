import React from 'react';
import { Link } from 'react-router-dom';
import useScript from '@/hooks/useScript';

function ProjectTargets({ match }) {
    const { path } = match;
    
    useScript('https://green-mud-01e386d10.1.azurestaticapps.net/scripts/ProjectTargets.js');

    return (
        <div>
            <h1>Harvest</h1>
            <p>This section can only be accessed by administrators.</p>

            Project: <div id="dropdownContainer"></div>
  
            <span id='colchart_before' style='width: 750px; height: 250px; display: inline-block'></span>
            
            <div id='infoboxName'>
            <span id='name'></span>
            <p/>
            <span id='gender'></span>
            </div>

            <p><Link to={`${path}/users`}>Manage Users</Link></p>
        </div>
    );
}

export { ProjectTargets };