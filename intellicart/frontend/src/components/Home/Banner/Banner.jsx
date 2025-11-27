import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Banner.css";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import gadgetSale from "../../../assets/images/Banners/gadget-sale.jpg";
import kitchenSale from "../../../assets/images/Banners/kitchen-sale.jpg";
import poco from "../../../assets/images/Banners/poco-m4-pro.webp";
import realme from "../../../assets/images/Banners/realme-9-pro.webp";
import fashionSale from "../../../assets/images/Banners/fashionsale.jpg";
import oppo from "../../../assets/images/Banners/oppo-reno7.webp";

export const PreviousBtn = ({ className, onClick }) => {
  return (
    <div className={`modern-arrow left-arrow ${className}`} onClick={onClick}>
      <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
    </div>
  );
};

export const NextBtn = ({ className, onClick }) => {
  return (
    <div className={`modern-arrow right-arrow ${className}`} onClick={onClick}>
      <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
    </div>
  );
};

const Banner = () => {
  const settings = {
    autoplay: true,
    autoplaySpeed: 2800,
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <PreviousBtn />,
    nextArrow: <NextBtn />,
  };

  const banners = [gadgetSale, kitchenSale, poco, fashionSale, realme, oppo];

  return (
    <section className="w-full h-48 sm:h-72 rounded-xl shadow-md overflow-hidden relative mt-4">
      <Slider {...settings}>
        {banners.map((src, i) => (
          <img
            key={i}
            src={src}
            draggable="false"
            className="w-full h-48 sm:h-72 object-cover rounded-xl"
            alt="banner"
          />
        ))}
      </Slider>
    </section>
  );
};

export default Banner;
