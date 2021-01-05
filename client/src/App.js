import React from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import Landing from "./components/layouts/Landing";
import NavBar from "./components/layouts/NavBar";
import Footer from "./components/layouts/Footer";
import BooksGenre from "./components/books/BooksGenre";
import BooksSearch from "./components/books/BooksSearch";
import ScrollToTop from "./components/layouts/ScrollToTop";
import BookDetail from "./components/books/BookDetail";
import Account from "./components/user/Account";

function App(props) {
  // console.log(props.auth);
  return (
    <div className="App">
      <NavBar />
      <main className={`main${!props.sideBar ? " center" : ""}`}>
        <Switch>
          <Route path="/books/genre/:genre" component={BooksGenre} />
          <Route path="/books/search" component={BooksSearch} />
          <Route path="/account" component={Account} />
          <Route path="/book/:id" component={BookDetail} />
          <Route path="/" component={Landing} exact />
        </Switch>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    sideBar: state.ui.sideBar,
  };
};

export default connect(mapStateToProps)(App);
