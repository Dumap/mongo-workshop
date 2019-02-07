import React, { Component } from "react";
import "./css/SearchBar.css";
import Review from "./Review.js";

class SearchByName extends Component {
  constructor() {
    super();
    this.state = {
      searchInput: "",
      reviews: null
    };
  }
  handleChange = e => {
    let newInput = e.target.value;
    this.setState({ searchInput: newInput });
  };
  handleSubmit = e => {
    e.preventDefault();
    let body = this.state.searchInput;
    fetch("/searchByName", {
      method: "POST",
      body: JSON.stringify(body)
    }).then(response => response.text())
    .then(response => {
      let parsedResponse = JSON.parse(response);
      if (parsedResponse.status) {
        this.setState({ reviews: parsedResponse.reviews });
        console.log(parsedResponse.message);
      }
    })
    .catch(err => console.log(err));
  this.setState({ searchInput: "" });
  };

  renderReviews = review => {
    return (
      <Review
        username={review.username}
        rating={review.rating}
        review={review.review}
      />
    );
  };
  render() {
    return (
      <div>
        <p>Search Reviews By Reviewer</p>
        <form onSubmit={this.handleSubmit}>
          <input
            className="searchBar byName"
            type="text"
            value={this.state.searchInput}
            onChange={this.handleChange}
          />
          <br />
          <input className="searchSubmit" type="submit" />
        </form>
        {this.state.reviews ? (
          this.state.reviews.map(this.renderReviews)
        ) : (
          <p>Enter a search query</p>
        )}
      </div>
    );
  }
}

export default SearchByName;
