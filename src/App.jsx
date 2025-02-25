import { useState } from "react";
import { options, currencyCon } from "./api/apiReq"; // Import API functions
import "./App.css";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

function App() {
  // State to store form data, including user input and converted amount
  const [formData, setFormData] = useState({
    amount: "", // User input amount
    fromCur: "", // Selected source currency
    toCur: "", // Selected target currency
    convertedAmount: "", // Stores the converted currency value
    conversionRate: "", //Stores the converted currency rate
  });

  // Fetch available currency options using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["options"], // Unique key to cache query data
    queryFn: options, // Function that fetches currency options
    placeholderData: keepPreviousData,
  });

  // Handle user input changes and update state accordingly
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevVals) => ({ ...prevVals, [name]: value }));
  };

  // Mutation to handle currency conversion API request
  const mutation = useMutation({
    mutationFn: ({ fromCur, toCur, amount }) =>
      currencyCon(fromCur, toCur, amount), // Calls API to get conversion rate
    onSuccess: (res) => {
      // Updates converted amount in state upon successful API response
      setFormData((prevVals) => ({
        ...prevVals,
        convertedAmount: res.conversion_result,
        conversionRate: res.conversion_rate,
      }));
    },
  });

  // Handle form submission when user clicks the Convert button
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevents default form submission behavior

    // Validate inputs to ensure all fields are filled
    if (!formData.amount || !formData.fromCur || !formData.toCur) {
      alert("Please fill all fields!!");
      return; // Stops form submission if validation fails
    }

    // Call mutation function to fetch converted amount
    mutation.mutate({
      fromCur: formData.fromCur,
      toCur: formData.toCur,
      amount: formData.amount,
    });
  };

  // Show loading message while fetching currency options
  if (isLoading) return <h1>Loading...</h1>;

  // Show error message if fetching currency options fails
  if (error) return <h1>{error.message}</h1>;

  return (
    <section className="main-section">
      <div className="container">
        <h1>Currency Converter RQ</h1>
        <hr />
        {/* Currency conversion form */}
        <form onSubmit={handleFormSubmit} className="form-section">
          <label htmlFor="amount">Enter Amount :</label>
          <input
            className="input-field"
            type="number"
            placeholder="Enter Amount"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
          <div className="selectors">
            <div>
              <label htmlFor="fromCur">From : </label>
              <select
                className="selector1"
                name="fromCur"
                id="fromCur"
                value={formData.fromCur}
                onChange={handleInputChange}
              >
                <option value="">From</option>
                {data?.map(([val, fullName]) => (
                  <option key={val} value={val}>
                    {fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="toCur">To : </label>
              <select
                className="selector2"
                name="toCur"
                id="toCur"
                value={formData.toCur}
                onChange={handleInputChange}
              >
                <option value="">To</option>
                {data?.map(([val, fullName]) => (
                  <option key={val} value={val}>
                    {fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Convert button is disabled if input is invalid or request is pending */}
          <button
            className="button-submit"
            type="submit"
            disabled={
              formData.amount <= 0 ||
              !formData.amount ||
              !formData.fromCur ||
              !formData.toCur ||
              mutation.isPending
            }
          >
            {mutation.isPending ? "Converting..." : "Convert"}
          </button>
        </form>

        {/* Display converted amount after successful conversion */}
        {mutation.isSuccess && (
          <h1>
            <pre>
              {formData.amount} {formData.fromCur} = {formData.convertedAmount}{" "}
              {formData.toCur}
            </pre>
            <pre>Conversion Rate : {formData.conversionRate}</pre>
          </h1>
        )}
      </div>
    </section>
  );
}

export default App;

// ! " https://currency-converter-rq.netlify.app/ "
