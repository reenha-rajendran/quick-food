import React from "react";
import Layout from "./../components/Layout/Layout";
import { Link } from "react-router-dom";
import Banner from "../images/banner.png";
import "../styles/HomeStyles.css";

const Home = () => {
  return (
    <Layout>
      <div className="home" style={{ backgroundImage: `url(${Banner})` }}>
        <div className="headerContainer">
          <h1>Welcome to Quick Food,</h1>
          <p>
            Experience Unmatched Convenience with Quick Food Delivery—Your
            Ultimate Solution for Fast, Fresh, and Flavorful Meals Delivered
            Right to Your Doorstep with Just a Click!
          </p>
          <Link to="/menu">
            <button>ORDER NOW</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
