import { useEffect, useState } from "react";
import classes from "./css/header.module.css";

const Header = ({ value, setValue, clickButton }) => {
  const [inputValue, setInputValue] = useState(value);

  const inputField = {
    valeu: inputValue,
    onChange: (e) => setInputValue(e.target.value),
    className: classes.search,
    placeholder: "Search By Label",
  };

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      setValue(inputValue);
    }, 500);
    return () => clearTimeout(timer);
  }, [inputValue]);

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <h1 className={classes.brand}>Images</h1>

        <input type="text" {...inputField} />
        <button className={classes.upload} onClick={clickButton}>
          Add Photo
        </button>
      </div>
    </header>
  );
};

export default Header;
