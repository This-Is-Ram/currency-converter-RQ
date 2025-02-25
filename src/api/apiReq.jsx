import axios from "axios";

const api = axios.create({
  baseURL: "https://v6.exchangerate-api.com/v6/1eeccfb59edc61c8c944107e",
});

// getting options
export const options = async () => {
  const res = await api.get("/codes");
  return res.data.supported_codes;
};

// currency convert api req
export const currencyCon = async (fromCurrency, toCurrency, amount) => {
  const res = await api.get(`/pair/${fromCurrency}/${toCurrency}/${amount}`);
  return res.data;
};
