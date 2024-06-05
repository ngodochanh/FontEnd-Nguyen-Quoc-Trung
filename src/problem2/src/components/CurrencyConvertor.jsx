import { useEffect, useState } from 'react';
import CurrencyDropDown from './CurrencyDropDown';
import { HiArrowsRightLeft } from 'react-icons/hi2';
import { toast } from 'react-toastify';

function CurrencyConvertor() {
  // State to manage the amount of currency to convert
  const [amount, setAmount] = useState(1);

  // State to store the list of available currencies fetched from an external API
  const [currencies, setCurrencies] = useState([]);

  // State to manage the currency selected as the source for conversion
  const [fromCurrency, setFromCurrency] = useState('USD');

  // State to manage the currency selected as the destination for conversion
  const [toCurrency, setToCurrency] = useState('ZIL');

  // State to store the converted amount after performing the conversion
  const [convertedAmount, setConvertedAmount] = useState(null);

  // State to track the state of the conversion process
  const [converting, setConverting] = useState(false);

  // State to store the list of favorite currencies selected by the user
  const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem('favorites')) || ['USD', 'ZIL']);

  // State to track if there is an error during data fetching
  const [fetchError, setFetchError] = useState(false);

  // Function to handle changes in the amount input field
  const handleOnChangeAmount = (e) => {
    setAmount(Number(e.target.value));
  };

  // Function to fetch the list of currencies from an external API
  const fetchCurrencies = async () => {
    try {
      const res = await fetch('https://interview.switcheo.com/prices.json');
      const data = await res.json();

      // Remove duplicate data based on currency, date, and price
      const uniqueData = {};
      data.forEach((item) => {
        const key = item.currency + item.date + item.price;
        uniqueData[key] = item;
      });

      const result = Object.values(uniqueData);
      setCurrencies(result);
    } catch (error) {
      toast.error('Error fetching currency data: ' + error.message);
      setFetchError(true);
    }
  };

  // Function to swap the source and destination currencies
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  // Function to retrieve the exchange rate of a currency from the currencies list
  const getCurrencyRate = (currencies, currency) => {
    const currencyItem = currencies.find((item) => item.currency === currency);
    return currencyItem ? currencyItem.price : null;
  };

  // Function to perform currency conversion
  const convertCurrency = (amount, fromCurrencyRate, toCurrencyRate) => {
    return Number((amount * (toCurrencyRate / fromCurrencyRate)).toFixed(2));
  };

  // Function to handle the currency swap event
  const handleSwap = (e) => {
    e.preventDefault();

    // Check if there was an error fetching data
    if (fetchError) {
      toast.error('Error fetching data. Please try again later');
      return;
    }

    // Check if amount is not a valid number or is negative
    if (amount <= 0 || isNaN(amount)) {
      toast.warn('Please enter a valid amount.');
      return;
    }

    // Start conversion process
    setConverting(true);

    // Add a delay of 1000 milliseconds (1 second) before continuing
    setTimeout(() => {
      // Get the exchange rates of currencies and perform conversion
      const fromCurrencyRate = getCurrencyRate(currencies, fromCurrency);
      const toCurrencyRate = getCurrencyRate(currencies, toCurrency);

      // Check if exchange rate is not available
      if (!fromCurrencyRate || !toCurrencyRate) {
        toast.warn('Exchange rate not available.');
        setConverting(false);
        return;
      }

      // Calculate the converted amount
      const convertedAmount = convertCurrency(amount, fromCurrencyRate, toCurrencyRate);

      // Check if the result is not a valid number
      if (isNaN(convertedAmount)) {
        toast('An error occurred while converting the amount. Please try again.');
        setConverting(false);
        return;
      }

      // Store the converted amount in state
      setConvertedAmount(convertedAmount + ' ' + toCurrency);
    }, 1000); // 1000 milliseconds (1 second)

    // End conversion process
    setConverting(false);
  };

  // Function to handle adding/removing currencies to/from favorites
  const handleFavorite = (currency) => {
    let updatedFavorites = [...favorites];

    if (favorites.includes(currency)) {
      updatedFavorites = updatedFavorites.filter((fav) => fav !== currency);
    } else {
      updatedFavorites.push(currency);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  // Fetch currencies data when the component mounts
  useEffect(() => {
    fetchCurrencies();
  }, []);

  // Render the component
  return (
    <form className='container max-w-3xl mx-auto my-10 p-5 bg-white rounded-lg shadow-md' onSubmit={handleSwap}>
      {/* Title */}
      <h2 className='mb-5 text-2xl font-semibold text-gray-700'>Currency Swap</h2>

      {/* Currency dropdowns */}
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 items-end'>
        <CurrencyDropDown
          currencies={currencies}
          currency={fromCurrency}
          setCurrency={setFromCurrency}
          title='From:'
          favorites={favorites}
          onFavorite={handleFavorite}
        />

        {/* Swap currency button */}
        <div className='flex justify-center'>
          <button className='p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300' onClick={swapCurrencies}>
            <HiArrowsRightLeft className='text-xl text-gray-700' />
          </button>
        </div>

        <CurrencyDropDown
          currencies={currencies}
          currency={toCurrency}
          setCurrency={setToCurrency}
          title='To:'
          favorites={favorites}
          onFavorite={handleFavorite}
        />
      </div>

      {/* Amount input */}
      <div className='mt-4'>
        <label htmlFor='amount' className='block text-sm font-medium text-gray-700'>
          Amount:
        </label>

        <input
          type='number'
          className='w-full p-2 border border-gray-300 rounded-md shadow-md mt-1 focus:outline-none focus:ring-2 focus:ring-indigo-500'
          value={amount}
          onChange={handleOnChangeAmount}
        />
      </div>

      {/* Button for confirming currency swap */}
      <div className='flex justify-end mt-6'>
        <button
          className={`px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
            converting && 'animate-pulse'
          }`}
          type='submit'
        >
          CONFIRM SWAP
        </button>
      </div>

      {/* Display converted amount */}
      {convertedAmount && (
        <div className='mt-4 text-lg font-medium text-right text-green-600'>Amount to receive: {convertedAmount}</div>
      )}
    </form>
  );
}

export default CurrencyConvertor;
