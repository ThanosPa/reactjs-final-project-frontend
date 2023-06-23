import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Link } from "react-router-dom";
import TakeoutDiningIcon from '@mui/icons-material/TakeoutDining';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Login from "./components/login.component";
import Register from "./components/register.component";
import Profile from "./components/profile.component";
import User from "./components/user.component";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { history } from "./helpers/history";
import EventBus from "./common/EventBus";
import HomepageComponent from "./components/homepage.component";
import myRecipesComponent from "./components/myrecipes.component";

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage());
    });
  }

  componentDidMount() {
    const user = this.props.user;

    if (user) {
      this.setState({
        currentUser: user,
      });
    }

    EventBus.on("logout", () => {
      this.logOut();
    });
  }

  componentWillUnmount() {
    EventBus.remove("logout");
  }

  logOut() {
    this.props.dispatch(logout());
    this.setState({
      currentUser: undefined,
    });
  }

  render() {
    const { currentUser } = this.state;

    return (
        <Router history={history}>

          <div>
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
            />
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <Link to={"/"} className="navbar-brand">
                Food Recipe App
              </Link>
            </nav>
            <Route exact path="/login" component={Login} />

            <div className="container-fluid">
              <div className="row " >
                {currentUser && (
                <div className="col-1 bg-light sidebar">
                  <ul className="nav flex-column">

                        <React.Fragment>
                          <li className="nav-item">
                            <Link to={"/"} className="nav-link">
                              <i className="fas fa-home fa-lg mr-2"></i>
                              Homepage
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link to={"/myrecipes"} className="nav-link">
                              <TakeoutDiningIcon></TakeoutDiningIcon>
                              My Recipes
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link to={"/collections"} className="nav-link">
                              <i className="fas fa-bookmark fa-lg mr-2"></i>
                              Collections
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link to={"/notifications"} className="nav-link">
                              <i className="fas fa-bell fa-lg mr-2"></i>
                              Notifications
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link to={"/logout"} className="nav-link" onClick={this.logOut}>
                              <i className="fas fa-sign-out-alt fa-lg mr-2"></i>
                              Logout
                            </Link>
                          </li>
                        </React.Fragment>

                  </ul>
                </div>
                )}
                <div className="col-10">
                  <Switch>
                    <Route exact path="/register" component={Register} />

                    <Route exact path="/register" component={Register} />
                    <Route exact path="/profile" component={Profile} />
                    <Route exact path="/user" component={User} />
                    <Route exact path={["/", "/home"]} component={HomepageComponent} />
                    <Route exact path="/logout" component={Login} />
                    <Route exact path="/myrecipes" component={myRecipesComponent} />

                  </Switch>
                </div>
              </div>
            </div>
          </div>
        </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(App);
