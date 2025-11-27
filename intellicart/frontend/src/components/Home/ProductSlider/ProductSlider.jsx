import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { getRandomProducts } from "../../../utils/functions";
import { PreviousBtn, NextBtn } from "../Banner/Banner";
import Product from "./Product";

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

const ProductSlider = ({ title, tagline }) => {
  const { loading, products } = useSelector((state) => state.products);

  return (
    <section className="w-full bg-white rounded-xl shadow-sm overflow-hidden py-4 mt-4">

      {/* Header */}
      <div className="flex justify-between items-center px-6 mb-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
          <p className="text-xs text-gray-500 mt-0.5">{tagline}</p>
        </div>

        <Link
          to="/products"
          className="text-sm px-4 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50 transition uppercase"
        >
          View All
        </Link>
      </div>

      {/* Slider */}
      {!loading && (
        <Slider {...sliderSettings} className="px-4">
          {products &&
            getRandomProducts(products, 12).map((product) => (
              <Product {...product} key={product._id} />
            ))}
        </Slider>
      )}
    </section>
  );
};

export default ProductSlider;
