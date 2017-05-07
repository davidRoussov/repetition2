import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, browserHistory } from 'react-router-dom';

import './style/style.css';
import Layout from './js/components/Layout';
import Main from './js/components/Main/Main'
import Browse from './js/components/Browse/Browse'

ReactDOM.render((
     <BrowserRouter history={browserHistory}>
      <div>
          <Route path='/' component={Layout}/>
          <Route exact path="/" component={Main}/>
          <Route path="/browse" component={Browse} />
      </div>
     </BrowserRouter>
     ),
     document.getElementById('root')
);