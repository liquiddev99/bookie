import React from "react";
import { connect } from "react-redux";

import BestSeller from "../books/BestSeller";
import Feature from "../books/Feature";
import Sale from "../books/Sale";
import Testimonial from "../books/Testimonial";
import SliderNav from "./SliderNav";
import CustomSlider from "./CustomSlider";

const Landing = (props) => {
  return (
    <div className={`main__landing${props.sideBar ? "" : " center"}`}>
      <SliderNav />
      <BestSeller />
      <Sale />
      <Feature />
      <Testimonial />
      <CustomSlider />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    sideBar: state.ui.sideBar,
  };
};

export default connect(mapStateToProps)(Landing);
