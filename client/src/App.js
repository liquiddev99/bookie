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
import Checkout from "./components/books/Checkout";
import Payment from "./components/books/Payment";
import Notification from "./components/layouts/Notification";
import AutoScrollToTop from "./components/layouts/AutoScrollToTop";
import NotFound from "./components/layouts/NotFound";

function App(props) {
  return (
    <div className="App">
      <NavBar />
      <main className={`main${!props.sideBar ? " center" : ""}`}>
        <AutoScrollToTop />
        <Switch>
          <Route path="/books/genre/:genre" component={BooksGenre} />
          <Route path="/books/search" component={BooksSearch} />
          <Route path="/account" component={Account} />
          <Route path="/book/:id" component={BookDetail} />
          <Route path="/checkout/payment" component={Payment} />
          <Route path="/checkout" component={Checkout} exact />
          <Route path="/" component={Landing} exact />
          <Route path="*" component={NotFound} />
        </Switch>
      </main>
      <Footer />
      <ScrollToTop />
      <Notification />
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    sideBar: state.ui.sideBar,
  };
};

export default connect(mapStateToProps)(App);
