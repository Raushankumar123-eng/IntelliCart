import mobiles from '../../assets/images/Categories/phone.png';
import fashion from '../../assets/images/Categories/fashion.png';
import electronics from '../../assets/images/Categories/electronics.png';
import home from '../../assets/images/Categories/home.png';
import travel from '../../assets/images/Categories/travel.png';
import appliances from '../../assets/images/Categories/appliances.png';
import furniture from '../../assets/images/Categories/furniture.png';
import beauty from '../../assets/images/Categories/beauty.png';
import grocery from '../../assets/images/Categories/grocery.png';
import auto from '../../assets/images/Categories/Automotive.jpg';
import books from '../../assets/images/Categories/BookAndStationaryLogo.jpg';
import computer from '../../assets/images/Categories/ComputerAccessoriesLogo.jpg';
import essentials from '../../assets/images/Categories/DailyEssentials.jpg';
import sports from '../../assets/images/Categories/FitnessCategoryLogo.png';
import music from '../../assets/images/Categories/MusicalInstrumentsLogo.jpg';
import gadgets from '../../assets/images/Categories/SmartGadgetsLogo.jpg';

import { Link } from 'react-router-dom';
import { useRef } from 'react';

const catNav = [
  { name: "Mobiles", icon: mobiles },
  { name: "Fashion", icon: fashion },
  { name: "Electronics", icon: electronics },
  { name: "Home", icon: home },
  { name: "Travel", icon: travel },
  { name: "Appliances", icon: appliances },
  { name: "Furniture", icon: furniture },
  { name: "Beauty, Toys & more", icon: beauty },
  { name: "Grocery", icon: grocery },
  { name: "Sports & Fitness", icon: sports },
  { name: "Books & Stationery", icon: books },
  { name: "Automotive", icon: auto },
  { name: "Smart Gadgets", icon: gadgets },
  { name: "Daily Essentials", icon: essentials },
  { name: "Computer Accessories", icon: computer },
  { name: "Musical Instruments", icon: music },
];

const Categories = () => {
  const slider = useRef(null);

  const scrollLeft = () => {
    slider.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    slider.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <section className="hidden sm:block w-full relative mt-24">

      {/* Left button */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg
        p-3 rounded-full"
      >
        ◀
      </button>

      {/* Slider */}

        <div
          ref={slider}
          className="flex overflow-x-scroll scrollbar-hide space-x-6 px-14 py-4"
        >


        {catNav.map((item, i) => (
          <Link
            to={`/products?category=${item.name}`}
            key={i}
            className="min-w-[110px] flex flex-col items-center justify-center p-4
            rounded-xl bg-white shadow hover:shadow-md transition-all border border-gray-100"
          >
            <div className="h-12 w-12">
              <img
                className="h-full w-full object-contain"
                src={item.icon}
                alt={item.name}
              />
            </div>
            <span className="text-xs font-medium text-center mt-2">
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* Right button */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg
        p-3 rounded-full"
      >
        ▶
      </button>
    </section>
  );
};

export default Categories;
