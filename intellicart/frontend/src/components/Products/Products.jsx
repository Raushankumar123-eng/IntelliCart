import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import MinCategory from '../Layouts/MinCategory';
import Product from './Product';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import StarIcon from '@mui/icons-material/Star';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';

const Products = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    // 🌟 Read category from URL properly
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "";
    const [category, setCategory] = useState(decodeURIComponent(initialCategory));

    const [price, setPrice] = useState([0, 200000]);
    const [ratings, setRatings] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [categoryToggle, setCategoryToggle] = useState(true);
    const [ratingsToggle, setRatingsToggle] = useState(true);

    const { products, loading, error, productsCount, resultPerPage, filteredProductsCount } = useSelector((state) => state.products);
    const keyword = params.keyword;

    const priceHandler = (e, newPrice) => {
        setPrice(newPrice);
    };

    const clearFilters = () => {
        setPrice([0, 200000]);
        setCategory("");
        setRatings(0);
        setCurrentPage(1);
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        // ⭐ Always decode category before sending to backend
        const formattedCategory = category ? decodeURIComponent(category) : "";

        dispatch(
            getProducts(
                keyword,
                formattedCategory,
                price,
                ratings,
                currentPage
            )
        );

    }, [dispatch, keyword, category, price, ratings, currentPage, error, enqueueSnackbar]);

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
                            <span className="uppercase text-primary-blue text-xs cursor-pointer font-medium" onClick={clearFilters}>
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
                                    <span className="flex-1 border px-4 py-1 bg-gray-50">₹{price[0].toLocaleString()}</span>
                                    <span className="font-medium text-gray-400">to</span>
                                    <span className="flex-1 border px-4 py-1 bg-gray-50">₹{price[1].toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-col border-b px-4">
                                <div className="flex justify-between cursor-pointer py-2 items-center"
                                    onClick={() => setCategoryToggle(!categoryToggle)}>
                                    <p className="font-medium text-xs uppercase">Category</p>
                                    {categoryToggle ?
                                        <ExpandLessIcon sx={{ fontSize: "20px" }} /> :
                                        <ExpandMoreIcon sx={{ fontSize: "20px" }} />}
                                </div>

                                {categoryToggle && (
                                    <FormControl>
                                        <RadioGroup
                                            onChange={(e) => {
                                                setCategory(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                            value={category}
                                        >
                                            {categories.map((el, i) => (
                                                <FormControlLabel
                                                    key={i}
                                                    value={el}
                                                    control={<Radio size="small" />}
                                                    label={<span className="text-sm">{el}</span>}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </div>

                            {/* Ratings Filter */}
                            <div className="flex flex-col border-b px-4">
                                <div className="flex justify-between cursor-pointer py-2 items-center"
                                    onClick={() => setRatingsToggle(!ratingsToggle)}>
                                    <p className="font-medium text-xs uppercase">ratings</p>
                                    {ratingsToggle ?
                                        <ExpandLessIcon sx={{ fontSize: "20px" }} /> :
                                        <ExpandMoreIcon sx={{ fontSize: "20px" }} />}
                                </div>

                                {ratingsToggle && (
                                    <FormControl>
                                        <RadioGroup
                                            onChange={(e) => {
                                                const encodedCategory = encodeURIComponent(e.target.value.trim());
                                                setCategory(encodedCategory);
                                                setCurrentPage(1);
                                            }}
                                            value={decodeURIComponent(category)}
                                        >
                                            {categories.map((el, i) => (
                                                <FormControlLabel
                                                    key={i}
                                                    value={el}
                                                    control={<Radio size="small" />}
                                                    label={<span className="text-sm">{el}</span>}
                                                />
                                            ))}
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
                                <img draggable="false" className="w-1/2 h-44 object-contain"
                                    src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/error-no-search-results_2353c5.png"
                                    alt="Search Not Found" />
                                <h1 className="text-2xl font-medium">Sorry, no results found!</h1>
                            </div>
                        )}

                        {loading ? <Loader /> : (
                            <div className="flex flex-col gap-2 pb-4 items-center bg-white">

                                <div className="grid grid-cols-1 sm:grid-cols-4 w-full pb-4 border-b">
                                    {products?.map((product) => (
                                        <Product {...product} key={product._id} />
                                    ))}
                                </div>

                                {filteredProductsCount > resultPerPage && (
                                    <Pagination
                                        count={Number(((filteredProductsCount + 6) / resultPerPage).toFixed())}
                                        page={currentPage}
                                        onChange={(e, val) => setCurrentPage(val)}
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
