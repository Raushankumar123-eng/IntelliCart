import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProducts } from '../../actions/productActions';
import Loader from '../Layouts/Loader/Loader';
import ProductCard from './ProductCard';
import Pagination from 'react-js-pagination';

// Utility: safe read/normalize category so backend gets expected format
const normalizeCategory = (c) => {
  if (!c) return '';
  // If category comes like "fashion" or "FASHION" -> make 'Fashion'
  const trimmed = String(c).trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};

const Products = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // --- Local UI state ---
  const [currentPage, setCurrentPage] = useState(1);
  const [price] = useState([0, 25000]); // example — adapt if you have a filter UI
  const [ratings] = useState(0);

  // Read query params (keyword, category, page, price, ratings)
  const query = new URLSearchParams(location.search);
  const rawKeyword = query.get('keyword') || '';
  const rawCategory = query.get('category') || '';
  const rawPage = parseInt(query.get('page') || '1', 10);

  useEffect(() => {
    // keep local page in sync with query param
    if (!Number.isNaN(rawPage) && rawPage !== currentPage) {
      setCurrentPage(rawPage);
    }
  }, [rawPage]);

  // Select products state from redux
  const { loading, products, productsCount, resPerPage } = useSelector((state) => state.products);

  // Fetch products whenever relevant query params change
  useEffect(() => {
    const keyword = rawKeyword;
    const category = normalizeCategory(rawCategory);

    // Call the action exactly as your backend expects: getProducts(keyword, category, price, ratings, page)
    dispatch(getProducts(keyword, category, price, ratings, currentPage));
  }, [dispatch, location.search, currentPage]);

  // When user picks a category (from UI buttons/dropdown), update query params properly
  const onCategorySelect = (categoryValue) => {
    const params = new URLSearchParams(location.search);

    if (categoryValue) {
      params.set('category', categoryValue);
    } else {
      params.delete('category');
    }

    // Reset to first page when changing category
    params.set('page', '1');

    // Keep other params like keyword intact
    navigate({ pathname: '/products', search: `?${params.toString()}` }, { replace: false });
  };

  const setPageNo = (pageNumber) => {
    const params = new URLSearchParams(location.search);
    params.set('page', String(pageNumber));
    navigate({ pathname: '/products', search: `?${params.toString()}` });
    // local state will sync via useEffect that listens to query param
  };

  // Example categories UI - adapt to your existing category menu/component
  const categories = ['All', 'Mobiles', 'Fashion', 'Appliances'];

  return (
    <div className="products-page">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="products-filters">
            <div className="categories">
              {categories.map((cat) => {
                const value = cat === 'All' ? '' : cat;
                // Highlight selected category
                const isActive = normalizeCategory(rawCategory) === normalizeCategory(value);
                return (
                  <button
                    key={cat}
                    className={`category-btn ${isActive ? 'active' : ''}`}
                    onClick={() => onCategorySelect(value)}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="products-list">
            {products && products.length > 0 ? (
              products.map((prod) => <ProductCard key={prod._id} product={prod} />)
            ) : (
              <div>No products found.</div>
            )}
          </div>

          {productsCount > resPerPage && (
            <div className="products-pagination">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resPerPage}
                totalItemsCount={productsCount}
                onChange={setPageNo}
                nextPageText={'Next'}
                prevPageText={'Prev'}
                firstPageText={'First'}
                lastPageText={'Last'}
                itemClass={'page-item'}
                linkClass={'page-link'}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;
