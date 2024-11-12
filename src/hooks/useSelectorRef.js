import { useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";

const useSelectorRef = (selector, equalityFn = shallowEqual) => {
  const valueRef = useRef();
  const selectedValue = useSelector(selector, equalityFn);

  useEffect(() => {
    valueRef.current = selectedValue;
  }, [selectedValue]);

  return [valueRef.current, valueRef];
};

export default useSelectorRef;
