import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { FibonacciPage } from "../../pages/fibonacci-page/fibonacci-page";
import { ListPage } from "../../pages/list-page/list-page";
import { MainPage } from "../../pages/main-page/main-page";
import { QueuePage } from "../../pages/queue-page/queue-page";
import { StringPage } from "../../pages/string-page/string-page";
import { SortingPage } from "../../pages/sorting-page/sorting-page";
import { StackPage } from "../../pages/stack-page/stack-page";

import styles from "./app.module.css";

import {Path} from "../../types/path";

function App() {
  return (
    <div className={styles.app}>
      <BrowserRouter basename='/algososh/'>
        <Switch>
          <Route path="/" exact>
            <MainPage />
          </Route>
          <Route path={Path.string}>
            <StringPage />
          </Route>
          <Route path={Path.fibonacci}>
            <FibonacciPage />
          </Route>
          <Route path={Path.sorting}>
            <SortingPage />
          </Route>
          <Route path={Path.stack}>
            <StackPage />
          </Route>
          <Route path={Path.queue}>
            <QueuePage />
          </Route>
          <Route path={Path.list}>
            <ListPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
