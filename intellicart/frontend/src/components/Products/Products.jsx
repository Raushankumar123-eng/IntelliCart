// frontend/src/components/Products/Products.jsx
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Pagination from "@mui/material/Pagination";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { clearErrors, getProducts } from "../../actions/productAction";
import Loader from "../Layouts/Loader";
import MinCategory from "../Layouts/MinCategory";
import Product from "./Product";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import StarIcon from "@mui/icons-material/Star";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";

// ---------------------------
// HELPER: Build Query String
// ---------------------------
const buildQueryString = (opts) => {
  const p = new URLSearchParams();

  if (opts.keyword) p.set("keyword", opts.keyword);
  if (opts.category) p.set("category", opts.category);

  p.set("price[gte]", opts.price?.[0] ?? 0);
  p.set("price[lte]", opts.price?.[1] ?? 200000);

  p.set("ratings[gte]", opts.ratings ?? 0);
  p.set("page", opts.page ?? 1);

  return p.toString();
};

// =============================
//       MAIN COMPONENT
// =============================
const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ----------------------------------
  // READ URL PARAMS (Single Truth)
  // ----------------------------------
  const qp = new URLSearchParams(location.search);

  const keywordFromURL = params.keyword || qp.get("keyword") || "";
  const categoryFromURL = qp.get("category") || "";

  const priceFromURL = [
    Number(qp.get("price[gte]") || 0),
    Number(qp.get("price[lte]") || 200000),
  ];

  const ratingFromURL = Number(qp.get("ratings[gte]") || 0);
  const pageFromURL = Number(qp.get("page") || 1);

  // ------------------------
  // LOCAL STATE
  // ------------------------
  const [keyword] = useState(keywordFromURL);
  const [category, setCategory] = useState(categoryFromURL);
  const [price, setPrice] = useState(priceFromURL);
  const [ratings, setRatings] = useState(ratingFromURL);
  const [currentPage, setCurrentPage] = useState(pageFromURL);

  const [categoryToggle, setCategoryToggle] = useState(true);
  const [ratingsToggle, setRatingsToggle] = useState(true);

  const {
    products,
    loading,
    error,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  // ------------------------
  // SYNC URL WITH STATE
  // ------------------------
  const syncUrl = (overrides = {}) => {
    const params = {
      keyword,
      category,
      price,
      ratings,
      page: currentPage,
      ...overrides,
    };

    const qs = buildQueryString(params);
    navigate(`/products?${qs}`);
  };

  // ------------------------
  // FILTER HANDLERS
  // ------------------------
  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1);
    syncUrl({ price: newPrice, page: 1 });
  };

  const onCategoryChange = (val) => {
    setCategory(val);
    setCurrentPage(1);
    syncUrl({ category: val, page: 1 });
  };

  const onRatingsChange = (val) => {
    setRatings(val);
    setCurrentPage(1);
    syncUrl({ ratings: val, page: 1 });
  };

  const clearFilters = () => {
    navigate(
      `/products?price[gte]=0&price[lte]=200000&ratings[gte]=0&page=1`
    );
    setCategory("");
    setPrice([0, 200000]);
    setRatings(0);
    setCurrentPage(1);
  };

  const setCurrentPageHandler = (val) => {
    setCurrentPage(val);
    syncUrl({ page: val });
  };

  // ------------------------
  // FETCH PRODUCTS
  // ------------------------
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    const qp2 = new URLSearchParams(location.search);

    const kw = qp2.get("keyword") || "";
    const cat = qp2.get("category") || "";
    const pg = Number(qp2.get("page") || 1);
    const p1 = Number(qp2.get("price[gte]") || 0);
    const p2 = Number(qp2.get("price[lte]") || 200000);
    const r = Number(qp2.get("ratings[gte]") || 0);

    dispatch(getProducts(kw, cat, [p1, p2], r, pg));
  }, [dispatch, location.search, error]);

  // ------------------------
  // RENDER UI
  // ------------------------
  return (
    <>
      <MetaData title="All Products | IntelliCart" />
      <MinCategory />

      <main className="w-full mt-14 sm:mt-0">
        <div className="flex gap-3 mt-2 sm:mx-3 mb-7">
          {/* ===========================
              FILTER SIDEBAR
          ============================= */}
          <div className="hidden sm:flex flex-col w-1/5 px-1 bg-white shadow">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <p className="text-lg font-medium">Filters</p>
              <span
                className="uppercase text-primary-blue text-xs cursor-pointer"
                onClick={clearFilters}
              >
                clear all
              </span>
            </div>

            <div className="flex flex-col gap-2 py-3 text-sm">
              {/* PRICE FILTER */}
              <div className="flex flex-col gap-2 border-b px-4">
                <span className="font-medium text-xs">PRICE</span>

                <Slider
                  value={price}
                  onChange={priceHandler}
                  min={0}
                  max={200000}
                  valueLabelDisplay="auto"
                />

                <div className="flex gap-3 items-center justify-between mb-2">
                  <span className="flex-1 border px-4 py-1 bg-gray-50">
                    ₹{price[0].toLocaleString()}
                  </span>
                  <span className="font-medium text-gray-400">to</span>
                  <span className="flex-1 border px-4 py-1 bg-gray-50">
                    ₹{price[1].toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CATEGORY FILTER */}
              <div className="flex flex-col border-b px-4">
                <div
                  className="flex justify-between cursor-pointer py-2"
                  onClick={() => setCategoryToggle(!categoryToggle)}
                >
                  <p className="font-medium text-xs uppercase">Category</p>
                  {categoryToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {categoryToggle && (
                  <FormControl>
                    <RadioGroup
                      value={category}
                      onChange={(e) => onCategoryChange(e.target.value)}
                    >
                      {categories.map((el, i) => (
                        <FormControlLabel
                          key={i}
                          value={el}
                          control={<Radio size="small" />}
                          label={<span className="text-sm">{el}</span>}
                        />
                      ))}

                      <FormControlLabel
                        value=""
                        control={<Radio size="small" />}
                        label="All"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </div>

              {/* RATINGS FILTER */}
              <div className="flex flex-col border-b px-4">
                <div
                  className="flex justify-between cursor-pointer py-2"
                  onClick={() => setRatingsToggle(!ratingsToggle)}
                >
                  <p className="font-medium text-xs uppercase">Ratings</p>
                  {ratingsToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>

                {ratingsToggle && (
                  <FormControl>
                    <RadioGroup
                      value={String(ratings)}
                      onChange={(e) =>
                        onRatingsChange(Number(e.target.value))
                      }
                    >
                      {[4, 3, 2, 1].map((el) => (
                        <FormControlLabel
                          key={el}
                          value={String(el)}
                          control={<Radio size="small" />}
                          label={
                            <span className="text-sm flex items-center">
                              {el}{" "}
                              <StarIcon sx={{ fontSize: 12 }} /> & above
                            </span>
                          }
                        />
                      ))}

                      <FormControlLabel
                        value="0"
                        control={<Radio size="small" />}
                        label="All"
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </div>
            </div>
          </div>

          {/* ===========================
              PRODUCT LIST
          ============================= */}
          <div className="flex-1">
            {!loading && (!products || products.length === 0) ? (
              <div className="p-8 bg-white shadow text-center">
                <h1 className="text-2xl font-medium">No Products Found</h1>
              </div>
            ) : loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col pb-4 bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 border-b p-2">
                  {products.map((p) => (
                    <Product key={p._id} {...p} />
                  ))}
                </div>

                {filteredProductsCount > resultPerPage && (
                  <Pagination
                    page={currentPage}
                    onChange={(e, value) =>
                      setCurrentPageHandler(value)
                    }
                    count={Math.ceil(
                      filteredProductsCount / resultPerPage
                    )}
                    color="primary"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Products;
