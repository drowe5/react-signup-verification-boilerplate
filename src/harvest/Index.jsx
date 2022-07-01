import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { ProjectTargets } from './ProjectTargets';

function Harvest({ match }) {
    const { path } = match;

    return (
        <div className="p-4">
            <div className="container">
                <Switch>
                    <Route exact path={path} component={ProjectTargets} />
                </Switch>
            </div>
        </div>
    );
}

export { Harvest };