import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import CardView from './CardView'
class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      projects: [
        {
          name: "football-two",
          dir: "https://github.com/kapit4n/football-two",
          img: "https://github.com/kapit4n/football-two/raw/master/mockups/football_two_championship_info_matches.png",
          features: [
            { text: "Championships", done: false },
            { text: "Teams", done: false },
            { text: "Matches", done: false }
          ]
        },
        {
          name: "ng-vendei",
          dir: "https://github.com/kapit4n/ng-vendei",
          img: "https://github.com/kapit4n/ng-vendei/raw/develop/mockups/vendei_shopping_cart_004.png",
          features: [
            { text: "Shopping cart", done: false },
            { text: "Products List", done: false },
            { text: "Orders", done: false }
          ]
        },
        {
          name: "react-2seller",
          dir: "https://github.com/kapit4n/react-2seller",
          img: "https://raw.githubusercontent.com/kapit4n/react-2seller/develop/mockups/react2-seller-home02.png",
          features: [
            { text: "Shopping cart", done: false },
            { text: "Products List", done: false },
            { text: "Orders", done: false }
          ]
        },
        {
          name: "l-projects",
          dir: "https://github.com/kapit4n/l-projects",
          img: "https://attcom.com.br/front/img/services/projeto.jpg",
          features: [
            { text: "Projects view", done: false },
            { text: "Project planning", done: false },
            { text: "Project features", done: false }
          ]
        },
        {
          name: "time-tracker",
          dir: "https://github.com/kapit4n/l-tracker",
          img: "http://rainer.jagdkommando.org/wp-content/uploads/2008/08/timetracker4.png",
          features: [
            { text: "Register start", done: false },
            { text: "Register end", done: false },
            { text: "Calculate", done: false }
          ]
        },
        {
          name: "t-stock",
          dir: "https://github.com/kapit4n/t-stock",
          img: "https://github.com/kapit4n/t-stock/raw/master/mockups/t-stock-cart.png",
          features: [
            { text: "Shopping cart", done: false },
            { text: "Products List", done: false },
            { text: "Orders", done: false }
          ]
        }
      ]
    }
  }

  render() {
    return (
      <div>
        <CardView projects={this.state.projects}></CardView>
      </div>
    )
  }
}

export default App;
