import React from 'react';
import App from './App';
import AdminApp from './AdminApp';
import { Route, Switch} from 'react-router-dom';


export const Routes = () => {
  return (
    <Switch>
      <Route exact path="/" component={AdminApp} />
      <Route path="/game/:id" component={App} />
    </Switch>
  );
}


