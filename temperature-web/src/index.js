import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import HomeScreen from './components/HomeScreen.js'

const darkTheme = createMuiTheme({
  palette: {
      type: 'dark',
      primary: {
          main: '#311b92',
      },
      secondary: {
          main: '#00e5ff',
      },
  },
});






ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <Router>
      <Route exact path='/' component={HomeScreen} />
    </Router>
    </ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
