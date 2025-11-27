import { Link } from "react-router-dom";

const categories = [
  "Mobiles",
  "Fashion",
  "Electronics",
  "Home",
  "Appliances",
  "Travel",
  "Furniture",
  "Beauty & Toys",
  "Grocery"
];

const CategoryNavbar = () => {
  return (
    <nav className="w-full bg-white shadow-sm border-b border-gray-200 mt-24">
      <div className="flex items-center justify-center gap-10 py-3 text-gray-700 font-medium text-sm">
        {categories.map((cat, i) => (
          <Link
            key={i}
            to={`/products?category=${cat}`}
            className="hover:text-blue-600 transition cursor-pointer"
          >
            {cat}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default CategoryNavbar;
