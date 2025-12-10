import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

import { clearErrors, getProducts } from '../../actions/productAction';
import Loader from '../Layouts/Loader';
import MinCategory from '../Layouts/MinCategory';
import Product from './Product';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';

const Products = () => {
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "";

    const [category, setCategory] = useState(encodeURIComponent(initialCategory.trim()));
    const [price, setPrice] = useState([0, 200000]);
    const [ratings, setRatings] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [categoryToggle, setCategoryToggle] = useState(true);
    const [ratingsToggle, setRatingsToggle] = useState(true);

    const { products, loading, error, resultPerPage, filteredProductsCount } =
        useSelector((state) => state.products);

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

        dispatch(
            getProducts(
                keyword,
                decodeURIComponent(category),
                price,
                ratings,
                currentPage
            )
        );
    }, [dispatch, keyword, category, price, ratings, currentPage, error]);

    return (
        <>
            <MetaData title="All Products | IntelliCart" />
            <MinCategory />

            <main className="w-full mt-14 sm:mt-0">
                <div className="flex gap-3 mt-2 sm:mx-3 m-auto mb-7">

                    {/* Filters */}
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

                        <div className="flex flex-col gap-2 py-3 text-sm">

                            {/* Price */}
                            <div className="flex flex-col gap-2 border-b px-4">
                                <span className="font-medium text-xs">PRICE</span>

                                <Slider
                                    value={price}
                                    onChange={priceHandler}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={200000}
                                />

                                <div className="flex gap-3 justify-between text-sm mb-2">
                                    <span>₹{price[0]}</span>
                                    <span>to</span>
                                    <span>₹{price[1]}</span>
                                </div>
                            </div>

                            {/* Category Filter */}
                            <div className="flex flex-col border-b px-4">
                                <div className="flex justify-between py-2 cursor-pointer"
                                    onClick={() => setCategoryToggle(!categoryToggle)}>
                                    <p className="font-medium text-xs uppercase">Category</p>
                                    {categoryToggle ?
                                        <ExpandLessIcon fontSize="20" /> :
                                        <ExpandMoreIcon fontSize="20" />}
                                </div>

                                {categoryToggle && (
                                    <FormControl>
                                        <RadioGroup
                                            value={decodeURIComponent(category)}
                                            onChange={(e) => {
                                                setCategory(encodeURIComponent(e.target.value));
                                                setCurrentPage(1);
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
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </div>

                            {/* Ratings Filter */}
                            <div className="flex flex-col border-b px-4">
                                <div className="flex justify-between py-2 cursor-pointer"
                                    onClick={() => setRatingsToggle(!ratingsToggle)}>
                                    <p className="font-medium text-xs uppercase">Ratings</p>
                                    {ratingsToggle ?
                                        <ExpandLessIcon fontSize="20" /> :
                                        <ExpandMoreIcon fontSize="20" />}
                                </div>

                                {ratingsToggle && (
                                    <FormControl>
                                        <RadioGroup
                                            value={ratings}
                                            onChange={(e) => {
                                                setRatings(e.target.value);
                                                setCurrentPage(1);
                                            }}
                                        >
                                            {[4, 3, 2, 1].map((el) => (
                                                <FormControlLabel
                                                    key={el}
                                                    value={el}
                                                    control={<Radio size="small" />}
                                                    label={<span className="flex text-sm items-center">
                                                        {el}<StarIcon sx={{ fontSize: "12px" }} /> & above
                                                    </span>}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </div>

                        </div>
                    </div>


                    {/* Products */}
                    <div className="flex-1">
                        {loading ?
                            <Loader /> :
                            (
                                <div className="bg-white flex flex-col gap-2 pb-4 items-center">

                                    <div className="grid grid-cols-1 sm:grid-cols-4 w-full pb-4 border-b">
                                        {products?.map((product) => (
                                            <Product {...product} key={product._id} />
                                        ))}
                                    </div>

                                    {filteredProductsCount > resultPerPage && (
                                        <Pagination
                                            count={Math.ceil(filteredProductsCount / resultPerPage)}
                                            page={currentPage}
                                            onChange={(e, val) => setCurrentPage(val)}
                                            color="primary"
                                        />
                                    )}
                                </div>
                            )
                        }
                    </div>

                </div>
            </main>
        </>
    );
};

export default Products;
