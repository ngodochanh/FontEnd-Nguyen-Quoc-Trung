import { HiOutlineStar, HiStar } from 'react-icons/hi';

/**
 * currencies: List of currencies containing currency, date, and price information
 * currency: Currently selected currency
 * setCurrency: Function to update the selected currency
 * title: Title of the dropdown
 * favorites: List of favorite currencies
 * onFavorite: Function to handle adding/removing currencies from favorites
 */

function CurrencyDropDown({ currencies, currency, setCurrency, title = '', favorites, onFavorite }) {
  // Function to check if a currency is in favorites
  const isFavorite = (curr) => favorites.includes(curr);

  return (
    <div>
      {/* Title */}
      <label htmlFor={title} className=' text-sm font-medium text-gray-700'>
        {title}
      </label>

      <div className='mt-1 relative'>
        {/* Dropdown select */}
        <select
          className='w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
          id={title}
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          {/* Render favorite currencies at the top of the dropdown */}
          {favorites.map((currency) => (
            <option className='bg-gray-200' value={currency} key={currency}>
              {currency}
            </option>
          ))}

          {/* Render non-favorite currencies */}
          {currencies
            .filter((c) => !favorites.includes(c))
            .map((item) => (
              <option key={item.currency + title + item.price} value={item.currency}>
                {item.currency}
              </option>
            ))}
        </select>

        {/* Favorite button */}
        <button
          className='absolute inset-y-0 right-5  flex items-center text-sm leading-5'
          onClick={() => onFavorite(currency)}
        >
          {/* Render different icon based on whether currency is favorite or not */}
          {isFavorite(currency) ? <HiStar className='text-amber-400' /> : <HiOutlineStar />}
        </button>
      </div>
    </div>
  );
}

export default CurrencyDropDown;
