import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productConstants";
import { createProduct, clearErrors } from "../../actions/productAction";
import ImageIcon from "@mui/icons-material/Image";
import { categories } from "../../utils/constants";
import MetaData from "../Layouts/MetaData";
import BackdropLoader from "../Layouts/BackdropLoader";

const NewProduct = () => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector(
    (state) => state.newProduct
  );

  // =======================
  // STATE
  // =======================
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [cuttedPrice, setCuttedPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState(0);
  const [warranty, setWarranty] = useState(0);

  const [brand, setBrand] = useState("");
  const [logo, setLogo] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  const [highlights, setHighlights] = useState([]);
  const [highlightInput, setHighlightInput] = useState("");

  const [specs, setSpecs] = useState([]);
  const [specsInput, setSpecsInput] = useState({
    title: "",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  // =======================
  // EFFECTS
  // =======================
  useEffect(() => {
    if (error) {
      enqueueSnackbar(error, { variant: "error" });
      dispatch(clearErrors());
    }

    if (success) {
      enqueueSnackbar("Product added successfully", {
        variant: "success",
      });

      dispatch({ type: NEW_PRODUCT_RESET });
      navigate("/admin/products");
    }
  }, [dispatch, error, success, enqueueSnackbar, navigate]);

  // =======================
  // HANDLERS
  // =======================
  const handleLogoChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setLogo(reader.result);
        setLogoPreview(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

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
      };
      reader.readAsDataURL(file);
    });
  };

  const addHighlight = () => {
    if (!highlightInput.trim()) return;
    setHighlights([...highlights, highlightInput]);
    setHighlightInput("");
  };

  const addSpecs = () => {
    if (!specsInput.title.trim() || !specsInput.description.trim()) return;
    setSpecs([...specs, specsInput]);
    setSpecsInput({ title: "", description: "" });
  };

  const newProductSubmitHandler = (e) => {
    e.preventDefault();

    if (!brand.trim())
      return enqueueSnackbar("Brand name is required", { variant: "warning" });
    if (!logo)
      return enqueueSnackbar("Brand logo is required", { variant: "warning" });
    if (highlights.length === 0)
      return enqueueSnackbar("Add highlights", { variant: "warning" });
    if (specs.length < 2)
      return enqueueSnackbar("Add minimum 2 specifications", {
        variant: "warning",
      });
    if (images.length === 0)
      return enqueueSnackbar("Add product images", { variant: "warning" });

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

  // =======================
  // JSX
  // =======================
  return (
    <>
      <MetaData title="Admin: New Product | IntelliCart" />

      {loading && <BackdropLoader />}

      <form
        onSubmit={newProductSubmitHandler}
        className="flex flex-col sm:flex-row bg-white rounded-lg shadow p-4"
      >
        {/* LEFT */}
        <div className="flex flex-col gap-3 m-2 sm:w-1/2">
          <TextField label="Name" size="small" required value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Description" multiline rows={3} size="small" required value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="flex gap-2">
            <TextField label="Price" type="number" size="small" required value={price} onChange={(e) => setPrice(e.target.value)} />
            <TextField label="Cutted Price" type="number" size="small" required value={cuttedPrice} onChange={(e) => setCuttedPrice(e.target.value)} />
          </div>

          <TextField select label="Category" size="small" required value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </TextField>

          <TextField label="Brand" size="small" required value={brand} onChange={(e) => setBrand(e.target.value)} />

          <label className="cursor-pointer bg-gray-400 text-white p-2 rounded text-center">
            Choose Logo
            <input type="file" hidden onChange={handleLogoChange} />
          </label>

          {logoPreview && <img src={logoPreview} alt="logo" className="h-20 object-contain" />}
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-3 m-2 sm:w-1/2">
          <TextField placeholder="Highlight" size="small" value={highlightInput} onChange={(e) => setHighlightInput(e.target.value)} />
          <button type="button" onClick={addHighlight} className="bg-blue-500 text-white p-2 rounded">Add Highlight</button>

          <TextField placeholder="Spec Title" size="small" value={specsInput.title} onChange={(e) => setSpecsInput({ ...specsInput, title: e.target.value })} />
          <TextField placeholder="Spec Description" size="small" value={specsInput.description} onChange={(e) => setSpecsInput({ ...specsInput, description: e.target.value })} />
          <button type="button" onClick={addSpecs} className="bg-blue-500 text-white p-2 rounded">Add Spec</button>

          <label className="cursor-pointer bg-gray-400 text-white p-2 rounded text-center">
            Choose Images
            <input type="file" hidden multiple onChange={handleProductImageChange} />
          </label>

          <button type="submit" className="bg-orange-500 text-white p-3 rounded font-medium">
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default NewProduct;
