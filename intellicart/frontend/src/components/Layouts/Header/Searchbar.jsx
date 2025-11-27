import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {

    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if(keyword.trim()){
            navigate(`/products/${keyword}`)
        } else {
            navigate('/products');
        }
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            className="w-full sm:w-8/12 h-11 px-4 flex items-center bg-white border border-gray-300 rounded-lg shadow-sm"
        >
            <input 
                value={keyword} 
                onChange={(e) => setKeyword(e.target.value)} 
                className="text-sm flex-1 outline-none placeholder-gray-500"
                type="text" 
                placeholder="Search for products, brands and more" 
            />
            <button type="submit" className="text-blue-600">
                <SearchIcon sx={{ fontSize: "22px" }} />
            </button>
        </form>
    );
};

export default Searchbar;
