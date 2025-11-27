import Slider from "react-slick";
import { Link } from "react-router-dom";
import Product from "./Product";
import { offerProducts } from "../../../utils/constants";
import { getRandomProducts } from "../../../utils/functions";
import { PreviousBtn, NextBtn } from "../Banner/Banner";

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 5,
  slidesToScroll: 5,
  prevArrow: <PreviousBtn />,
  nextArrow: <NextBtn />,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 3, slidesToScroll: 3 },
    },
    {
      breakpoint: 600,
      settings: { slidesToShow: 2, slidesToScroll: 2 },
    },
    {
      breakpoint: 480,
      settings: { slidesToShow: 1, slidesToScroll: 1 },
    },
  ],
};

const DealSlider = ({ title }) => {
  return (
    <section className="w-full bg-white rounded-xl shadow-sm overflow-hidden py-4 mt-4">

      {/* Header */}
      <div className="flex justify-between items-center px-6 mb-3">
        <h1 className="text-xl font-semibold text-gray-800">{title}</h1>

        <Link
          to="/products"
          className="text-sm px-4 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
        >
          View All
        </Link>
      </div>

      {/* Slider */}
      <Slider {...sliderSettings} className="px-4">
        {getRandomProducts(offerProducts, 12).map((item, i) => (
          <Product {...item} key={i} />
        ))}
      </Slider>
    </section>
  );
};

export default DealSlider;
