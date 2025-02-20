// src/components/CoursePrice.jsx
import React from "react";
import useCurrencyStore from "../store/currencyStore";
import { convertPrice } from "../utils/currencyUtils";

const CoursePrice = ({ price }) => {
  const { currency } = useCurrencyStore();
  return (
    <span className="font-semibold text-gray-800">
      {convertPrice(price, currency)} {currency}
    </span>
  );
};

export default CoursePrice;
