import React, { Component } from "react";
import "./css/SearchBar.css";
import Review from "./Review.js";

class SearchDescription extends Component {
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
    let search = this.state.searchInput;
    fetch("/searchByDesc", {
      method: "POST",
      body: JSON.stringify(search)
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
        <p>Search for reviews based on what is in the review body</p>
        <form onSubmit={this.handleSubmit}>
          <input
            type="text"
            value={this.state.searchInput}
            onChange={this.handleChange}
            className="searchBar reviews"
          />
          <br />
          <input className="searchSubmit" type="submit" />
        </form>
        {this.state.reviews ? (
          this.state.reviews.map(this.renderReviews)
        ) : (
          <p>Search for Reviews by description</p>
        )}
      </div>
    );
  }
}

export default SearchDescription;
