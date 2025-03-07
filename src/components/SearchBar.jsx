import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Search, X } from 'lucide-react';

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
  {/* code for search bar so that it can only visible in collection page   */}
// const [visible,setVisible]= useState(false);
// const location = useLocation();
// useEffect(()=> {
//   if(location.pathname.includes('collection')) {
//     setVisible(true);
//   }
//   else {
//     setVisible(false)
//   }
// },[location])
  return showSearch ? (
    <div className='fixed top-16 left-0 right-0 bg-white shadow-lg z-50 transition-all duration-300 transform'>
      <div className='container mx-auto px-4 py-3'>
        <div className='relative max-w-2xl mx-auto'>
          <div className='flex items-center bg-gray-50 border border-gray-200 rounded-full overflow-hidden hover:border-blue-400 transition-all duration-300'>
            <Search className='w-5 h-5 text-gray-400 ml-4' />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className='flex-1 px-4 py-2 bg-transparent outline-none text-gray-700 placeholder-gray-400'
              type="text"
              placeholder='Search products...'
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className='p-2 hover:bg-gray-100 rounded-full mr-1'
              >
                <X className='w-4 h-4 text-gray-400' />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSearch(false)}
            className='absolute -right-12 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors duration-300'
          >
            <X className='w-5 h-5 text-gray-500 hover:text-gray-700' />
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default SearchBar