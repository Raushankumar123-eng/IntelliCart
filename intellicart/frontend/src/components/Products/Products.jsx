import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Pagination from '@mui/material/Pagination';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Slider from '@mui/material/Slider';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const params = useParams();
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get("category") || "";
    const [category, setCategory] = useState(initialCategory);

    const [price, setPrice] = useState([0, 200000]);
    const [ratings, setRatings] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const [categoryToggle, setCategoryToggle] = useState(true);
    const [ratingsToggle, setRatingsToggle] = useState(true);

    const { products, loading, error, filteredProductsCount, resultPerPage } =
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
        navigate("/products");
    };

    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        dispatch(getProducts(keyword, category, price, ratings, currentPage));

        navigate(`/products?category=${category}`);

    }, [dispatch, keyword, category, price, ratings, currentPage]);

    return (
        <>
            <MetaData title="All Products | IntelliCart" />
            <MinCategory />

            <main className="w-full mt-14 sm:mt-0">
                <div className="flex gap-3 mt-2 sm:mt-2 sm:mx-3 m-auto mb-7">

                    {/* Filters */}
                    <div className="hidden sm:flex flex-col w-1/5 px-1 bg-white shadow">

                        <div className="flex items-center justify-between gap-5 px-4 py-2 border-b">
                            <p className="text-lg font-medium">Filters</p>
                            <span className="uppercase text-primary-blue text-xs cursor-pointer font-medium" onClick={clearFilters}>
                                clear all
                            </span>
                        </div>

                        {/* Category */}
                        <div className="flex flex-col border-b px-4">
                            <div className="flex justify-between cursor-pointer py-2 items-center"
                                onClick={() => setCategoryToggle(!categoryToggle)}
                            >
                                <p className="font-medium text-xs uppercase">Category</p>
                                {categoryToggle ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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
                    </div>

                    {/* 📌 Product Display */}
                    <div className="flex-1">

                        {!loading && products?.length === 0 && (
                            <div className="flex flex-col items-center">
                                <h1 className="text-lg font-medium mt-10">
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
