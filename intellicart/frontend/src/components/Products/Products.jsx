import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Pagination from "@mui/material/Pagination";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Slider from "@mui/material/Slider";
import { useSnackbar } from "notistack";
import { useState, useEffect, useMemo } from "react";
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

const Products = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // ---------------- URL HANDLING ----------------

  // path param: /products/:keyword  (used by search bar)
  const rawKeyword = params.keyword ? decodeURIComponent(params.keyword) : "";

  // query param: /products?category=Mobiles  (used by category links)
  const queryParams = new URLSearchParams(location.search);
  const categoryFromQuery = queryParams.get("category") || "";

  // helper: normalize string and match with categories list
  const normalizeCategory = (value) => {
    if (!value) return "";
    const lower = value.toLowerCase();
    const match = categories.find((c) => c.toLowerCase() === lower);
    return match || "";
  };

  // if URL has ?category=, use that
  // else, if /products/fashion and "fashion" matches a category, treat it as category (NOT keyword)
  const initialCategory = useMemo(() => {
    if (categoryFromQuery) return normalizeCategory(categoryFromQuery);
    if (rawKeyword) return normalizeCategory(rawKeyword);
    return "";
  }, [categoryFromQuery, rawKeyword]);

  // final keyword to send to backend:
  // if path part is actually a category -> don't use it as keyword
  const effectiveKeyword = initialCategory ? "" : rawKeyword;

  // ---------------- STATE ----------------

  const [category, setCategory] = useState(initialCategory);
  const [price, setPrice] = useState([0, 200000]);
  const [ratings, setRatings] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [categoryToggle, setCategoryToggle] = useState(true);
  const [ratingsToggle, setRatingsToggle] = useState(true);

  const {
    products,
    loading,
    error,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  } = useSelector((state) => state.products);

  // ---------------- URL <-> STATE sync on mount ----------------

  useEffect(() => {
    const qp = new URLSearchParams(location.search);

    const cat = qp.get("category") || "";
    const page = Number(qp.get("page") || 1);
    const priceGte = Number(qp.get("price[gte]") || 0);
    const priceLte = Number(qp.get("price[lte]") || 200000);
    const r = Number(qp.get("ratings[gte]") || 0);

    setCategory(normalizeCategory(cat));
    setCurrentPage(page);
    setPrice([priceGte, priceLte]);
    setRatings(r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ---------------- helper to update URL params ----------------

  const updateUrlParams = (overrides = {}) => {
    const params = new URLSearchParams(location.search);

    // keep keyword if present (path or query)
    const kw = params.get("keyword") || rawKeyword;
    if (kw) params.set("keyword", kw);

    // category
    if (overrides.category !== undefined) {
      if (overrides.category) params.set("category", overrides.category);
      else params.delete("category");
    }

    // page
    if (overrides.page !== undefined) {
      params.set("page", String(overrides.page));
    }

    // price
    if (overrides.price !== undefined && Array.isArray(overrides.price)) {
      params.set("price[gte]", String(overrides.price[0]));
      params.set("price[lte]", String(overrides.price[1]));
    }

    // ratings
    if (overrides.ratings !== undefined) {
      params.set("ratings[gte]", String(overrides.ratings));
    }

    // navigate (will trigger effect that reads location.search)
    navigate({ pathname: "/products", search: `?${params.toString()}` });
  };

  // ---------------- HANDLERS ----------------

  const priceHandler = (e, newPrice) => {
    setPrice(newPrice);
    setCurrentPage(1);
    updateUrlParams({ price: newPrice, page: 1 });
  };

  const clearFilters = () => {
    setPrice([0, 200000]);
    setCategory("");
    setRatings(0);
    setCurrentPage(1);

    // remove related params
    const params = new URLSearchParams(location.search);
    params.delete("category");
    params.delete("page");
    params.set("price[gte]", "0");
    params.set("price[lte]", "200000");
    params.set("ratings[gte]", "0");
    navigate({ pathname: "/products", search: `?${params.toString()}` });
  };

  const onCategoryChange = (val) => {
    setCategory(val);
    setCurrentPage(1);
    if (val) updateUrlParams({ category: val, page: 1 });
    else updateUrlParams({ category: undefined, page: 1 });
  };

  const onRatingsChange = (val) => {
    setRatings(val);
    setCurrentPage(1);
    updateUrlParams({ ratings: val, page: 1 });
  };

  const setCurrentPageHandler = (val) => {
    setCurrentPage(val);
    updateUrlParams({ page: val });
  };

  // ---------------- EFFECT: FETCH PRODUCTS based on URL ----------------

  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    // read final params from URL to guarantee exact values
    const qp = new URLSearchParams(location.search);
    const cat = qp.get("category") || "";
    const p = Number(qp.get("page") || 1);
    const priceGte = Number(qp.get("price[gte]") || 0);
    const priceLte = Number(qp.get("price[lte]") || 200000);
    const r = Number(qp.get("ratings[gte]") || 0);

    // If initialCategory was derived from the raw keyword (e.g., /products/fashion),
    // we must preserve the earlier logic where such category-like path should not be used as keyword.
    const keywordToSend = initialCategory && !categoryFromQuery ? "" : effectiveKeyword;

    dispatch(
      getProducts(
        keywordToSend,
        cat,
        [priceGte, priceLte],
        r,
        p
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, location.search, error, enqueueSnackbar]);

  // ---------------- RENDER ----------------

  return (
    <>
      <MetaData title="All Products | IntelliCart" />
      <MinCategory />

      <main className="w-full mt-14 sm:mt-0">
        <div className="flex gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">
          {/* Filter Sidebar */}
          <div className="hidden sm:flex flex-col w-1/5 px-1 bg-white shadow">
            <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
              <p className="text-lg font-medium">Filters</p>
              <span
                className="uppercase text-primary-blue text-xs cursor-pointer font-medium"
                onClick={clearFilters}
              >
                clear all
              </span>
            </div>

            <div className="flex flex-col gap-2 py-3 text-sm overflow-hidden">
              {/* Price Filter */}
              <div className="flex flex-col gap-2 border-b px-4">
                <span className="font-medium text-xs">PRICE</span>

                <Slider
                  value={price}
                  onChange={priceHandler}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200000}
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

              {/* Category Filter */}
              <div className="flex flex-col border-b px-4">
                <div
                  className="flex justify-between cursor-pointer py-2 items-center"
                  onClick={() => setCategoryToggle(!categoryToggle)}
                >
                  <p className="font-medium text-xs uppercase">Category</p>
                  {categoryToggle ? (
                    <ExpandLessIcon sx={{ fontSize: "20px" }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: "20px" }} />
                  )}
                </div>

                {categoryToggle && (
                  <FormControl>
                    <RadioGroup
                      value={category}
                      onChange={(e) => {
                        onCategoryChange(e.target.value);
                      }}
                    >
                      {categories.map((el, i) => (
                        <FormControlLabel
                          key={i}
                          value={el}
                          control={<Radio size="small" />}
                          label={<span className="text-sm">{el}</span>}
                        />
                      ))}
                      {/* Option to clear category */}
                      <FormControlLabel
                        value={""}
                        control={<Radio size="small" />}
                        label={<span className="text-sm">All</span>}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </div>

              {/* Ratings Filter */}
              <div className="flex flex-col border-b px-4">
                <div
                  className="flex justify-between cursor-pointer py-2 items-center"
                  onClick={() => setRatingsToggle(!ratingsToggle)}
                >
                  <p className="font-medium text-xs uppercase">ratings</p>
                  {ratingsToggle ? (
                    <ExpandLessIcon sx={{ fontSize: "20px" }} />
                  ) : (
                    <ExpandMoreIcon sx={{ fontSize: "20px" }} />
                  )}
                </div>

                {ratingsToggle && (
                  <FormControl>
                    <RadioGroup
                      value={String(ratings)}
                      onChange={(e) => {
                        onRatingsChange(Number(e.target.value));
                      }}
                    >
                      {[4, 3, 2, 1].map((el) => (
                        <FormControlLabel
                          key={el}
                          value={String(el)}
                          control={<Radio size="small" />}
                          label={
                            <span className="flex items-center text-sm">
                              {el}
                              <StarIcon sx={{ fontSize: "12px", mr: 0.5 }} />{" "}
                              &amp; above
                            </span>
                          }
                        />
                      ))}
                      <FormControlLabel
                        value={"0"}
                        control={<Radio size="small" />}
                        label={<span className="text-sm">All</span>}
                      />
                    </RadioGroup>
                  </FormControl>
                )}
              </div>
            </div>
          </div>

          {/* Products List */}
          <div className="flex-1">
            {!loading && products?.length === 0 && (
              <div className="flex flex-col items-center justify-center p-6 sm:p-16 bg-white shadow-sm rounded-sm">
                <img
                  draggable="false"
                  className="w-1/2 h-44 object-contain"
                  src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
                  alt="Search Not Found"
                />
                <h1 className="text-2xl font-medium">
                  Sorry, no results found!
                </h1>
              </div>
            )}

            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col gap-2 pb-4 items-center bg-white">
                <div className="grid grid-cols-1 sm:grid-cols-4 w-full pb-4 border-b">
                  {products?.map((product) => (
                    <Product {...product} key={product._id} />
                  ))}
                </div>

                {filteredProductsCount > resultPerPage && (
                  <Pagination
                    count={Number(
                      ((filteredProductsCount + 6) / resultPerPage).toFixed()
                    )}
                    page={currentPage}
                    onChange={(e, val) => setCurrentPageHandler(val)}
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
