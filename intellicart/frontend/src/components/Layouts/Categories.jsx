import mobiles from '../../assets/images/Categories/phone.png';
import fashion from '../../assets/images/Categories/fashion.png';
import electronics from '../../assets/images/Categories/electronics.png';
import home from '../../assets/images/Categories/home.png';
import travel from '../../assets/images/Categories/travel.png';
import appliances from '../../assets/images/Categories/appliances.png';
import furniture from '../../assets/images/Categories/furniture.png';
import beauty from '../../assets/images/Categories/beauty.png';
import grocery from '../../assets/images/Categories/grocery.png';
import { Link } from 'react-router-dom';

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
];

const Categories = () => {
  return (
    <section className="hidden sm:block w-full bg-white mt-32 mb-6">
      
      <div className="w-full grid grid-cols-9 px-6 py-4 gap-6">

        {catNav.map((item, i) => (
          <Link
            to={`/products?category=${item.name}`}
            key={i}
            className="flex flex-col items-center justify-center p-4
                       rounded-xl bg-white shadow hover:shadow-md 
                       transition-all border border-gray-100 hover:border-blue-400"
          >
            <div className="h-12 w-12">
              <img
                draggable="false"
                className="h-full w-full object-contain"
                src={item.icon}
                alt={item.name}
              />
            </div>
            <span className="text-xs text-gray-700 font-medium mt-2 text-center">
              {item.name}
            </span>
          </Link>
        ))}

      </div>

    </section>
  );
};

export default Categories;
