import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import { createProduct, clearErrors } from '../../actions/productAction';
import ImageIcon from '@mui/icons-material/Image';
import { categories } from '../../utils/constants';
import MetaData from '../Layouts/MetaData';
import BackdropLoader from '../Layouts/BackdropLoader';

const NewProduct = () => {

    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const { loading, success, error } = useSelector((state) => state.newProduct);

    const [highlights, setHighlights] = useState([]);
    const [highlightInput, setHighlightInput] = useState("");
    const [specs, setSpecs] = useState([]);
    const [specsInput, setSpecsInput] = useState({
        title: "",
        description: ""
    });

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [cuttedPrice, setCuttedPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [warranty, setWarranty] = useState(0);
    const [brand, setBrand] = useState("");
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const [logo, setLogo] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

    // =========================
    // SUCCESS / ERROR HANDLING
    // =========================
    useEffect(() => {
        if (error) {
            enqueueSnackbar(error, { variant: "error" });
            dispatch(clearErrors());
        }

        if (success) {
            enqueueSnackbar("Product added successfully", { variant: "success" });
            dispatch({ type: NEW_PRODUCT_RESET });
            navigate("/admin/products");
        }
    }, [dispatch, error, success, enqueueSnackbar, navigate]);

    const handleSpecsChange = (e) => {
        setSpecsInput({ ...specsInput, [e.target.name]: e.target.value });
    }

    const addSpecs = () => {
        if (!specsInput.title.trim() || !specsInput.description.trim()) return;
        setSpecs([...specs, specsInput]);
        setSpecsInput({ title: "", description: "" });
    }

    const addHighlight = () => {
        if (!highlightInput.trim()) return;
        setHighlights([...highlights, highlightInput]);
        setHighlightInput("");
    }

    const deleteHighlight = (index) => {
        setHighlights(highlights.filter((_, i) => i !== index))
    }

    const deleteSpec = (index) => {
        setSpecs(specs.filter((_, i) => i !== index))
    }

    const handleLogoChange = (e) => {
        const reader = new FileReader();
        reader.onload = () => {
            if (reader.readyState === 2) {
                setLogoPreview(reader.result);
                setLogo(reader.result);
            }
        };
        reader.readAsDataURL(e.target.files[0]);
    }

    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages([]);
        setImagesPreview([]);

        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result]);
                    setImages((old) => [...old, reader.result]);
                }
            }
            reader.readAsDataURL(file);
        });
    }

    const newProductSubmitHandler = (e) => {
        e.preventDefault();

        if (!brand.trim()) {
            enqueueSnackbar("Brand name is required", { variant: "warning" });
            return;
        }
        if (!logo) {
            enqueueSnackbar("Brand logo is required", { variant: "warning" });
            return;
        }
        if (highlights.length === 0) {
            enqueueSnackbar("Add Highlights", { variant: "warning" });
            return;
        }
        if (specs.length < 2) {
            enqueueSnackbar("Add minimum 2 specifications", { variant: "warning" });
            return;
        }
        if (images.length === 0) {
            enqueueSnackbar("Add product images", { variant: "warning" });
            return;
        }

        const productData = {
            name,
            description,
            price,
            cuttedPrice,
            category,
            stock,
            warranty,
            highlights,
            specifications: specs,
            images,
            brand: {
                name: brand,
                logo: {
                    public_id: "brand-logo",
                    url: logo,
                },
            },
        };

        dispatch(createProduct(productData));
    };

    return (
        <>
            <MetaData title="Admin: New Product | IntelliCart" />

            {loading && <BackdropLoader />}

            <form onSubmit={newProductSubmitHandler} encType="multipart/form-data"
                className="flex flex-col sm:flex-row bg-white rounded-lg shadow p-4"
                id="mainform">

                {/* LEFT */}
                <div className="flex flex-col gap-3 m-2 sm:w-1/2">
                    <TextField label="Name" size="small" required value={name} onChange={(e) => setName(e.target.value)} />
                    <TextField label="Description" multiline rows={3} size="small" required value={description} onChange={(e) => setDescription(e.target.value)} />

                    <div className="flex justify-between">
                        <TextField label="Price" type="number" size="small" required value={price} onChange={(e) => setPrice(e.target.value)} />
                        <TextField label="Cutted Price" type="number" size="small" required value={cuttedPrice} onChange={(e) => setCuttedPrice(e.target.value)} />
                    </div>

                    <div className="flex justify-between gap-4">
                        <TextField label="Category" select fullWidth size="small" required value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map((el, i) => (
                                <MenuItem value={el} key={i}>{el}</MenuItem>
                            ))}
                        </TextField>

                        <TextField label="Stock" type="number" size="small" required value={stock} onChange={(e) => setStock(e.target.value)} />
                        <TextField label="Warranty" type="number" size="small" required value={warranty} onChange={(e) => setWarranty(e.target.value)} />
                    </div>

                    <h2 className="font-medium">Add Highlights</h2>

                    {/* Highlights */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center border rounded">
                            <input
                                value={highlightInput}
                                onChange={(e) => setHighlightInput(e.target.value)}
                                type="text"
                                placeholder="Highlight"
                                className="px-2 flex-1 outline-none border-none"
                            />
                            <span
                                onClick={addHighlight}
                                className="py-2 px-6 bg-primary-blue text-white rounded-r hover:shadow-lg cursor-pointer"
                            >
                                Add
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            {highlights.map((h, i) => (
                                <div
                                    key={i}
                                    className="flex justify-between rounded items-center py-1 px-2 bg-green-50"
                                >
                                    <p className="text-green-800 text-sm font-medium">{h}</p>
                                    <span
                                        onClick={() => deleteHighlight(i)}
                                        className="text-red-600 hover:bg-red-100 p-1 rounded-full cursor-pointer"
                                    >
                                        <DeleteIcon />
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>


                    <h2 className="font-medium">Brand Details</h2>

                    <div className="flex justify-between gap-4 items-start">
                        <TextField label="Brand" size="small" required value={brand} onChange={(e) => setBrand(e.target.value)} />

                        <div className="w-24 h-10 flex items-center justify-center border rounded-lg">
                            {!logoPreview ? <ImageIcon /> :
                                <img src={logoPreview} alt="Brand Logo" className="w-full h-full object-contain" />
                            }
                        </div>

                        <label className="rounded bg-gray-400 text-center cursor-pointer text-white py-2 px-2.5 shadow">
                            <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                            Choose Logo
                        </label>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex flex-col gap-2 m-2 sm:w-1/2">
                    <h2 className="font-medium">Product Images</h2>

                    <div className="flex gap-2 overflow-x-auto h-32 border rounded">
                        {imagesPreview.map((image, i) => (
                            <img src={image} alt="Product" key={i} className="w-full h-full object-contain" />
                        ))}
                    </div>

                    <label className="rounded font-medium bg-gray-400 text-center cursor-pointer text-white p-2 shadow my-2">
                        <input type="file" multiple accept="image/*" onChange={handleProductImageChange} className="hidden" />
                        Choose Files
                    </label>

                    <div className="flex justify-end">
                        <input type="submit"
                            className="bg-primary-orange uppercase w-1/3 p-3 text-white font-medium rounded shadow cursor-pointer"
                            value="Submit" />
                    </div>
                </div>
            </form>
        </>
    );
};

export default NewProduct;
