import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import React from 'react';
import './App.css';

import Main from './views/main'
import Host from './views/host'
import Player from './views/player'
import Editor from './views/editor'
import Page404 from './views/page404'

const loading = () => <div>Ładowanie...</div>;

function App() {

  return (
      <HashRouter>
          <React.Suspense fallback={loading()}>
              <Switch>
                  <Route exact path="/" name="Quizario" render={props => <Main {...props}/>} />
                  <Route exact path="/host" name="Utwórz pokój" render={props => <Host {...props}/>} />
                  <Route exact path="/editor" name="Edytor pytań" render={props => <Editor {...props}/>} />
                  <Route exact path="/code/:code" name="Utwórz pokój" render={props => <Player {...props}/>} />
                  <Route exact path="/404" name="Strona nie istnieje" render={props => <Page404 {...props}/>} />
                  <Route name="NOT_FOUND" render={props => <Redirect to="/404" />} />
              </Switch>
          </React.Suspense>
      </HashRouter>
  );
}

export default App;
