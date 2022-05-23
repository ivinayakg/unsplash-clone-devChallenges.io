import { createPortal } from "react-dom";
import classes from "./css/addphoto.module.css";
import { XIcon } from "@heroicons/react/solid";
import axios from "../api";

const AddPhoto = ({ closeModal }) => {
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = {};
    for (let x of new FormData(e.target)) {
      formData[x[0]] = x[1];
    }

    try {
      const res = await axios.post("/upload", formData);
      window.location.reload();
    } catch (error) {}
  };

  return createPortal(
    <div className={classes.back}>
      <form onSubmit={submitHandler} className={classes.modal}>
        <div className={classes.heading}>
          <h2>Add A Photo</h2>
          <button className={classes.cross} onClick={closeModal}>
            <XIcon />
          </button>
        </div>
        <label htmlFor="label">Label</label>
        <input required type="text" id="label" name="label" />
        <label htmlFor="url">Photo Url</label>
        <input required type="text" id="url" name="url" />
        <button type="submit">Add</button>
      </form>
    </div>,
    document.body
  );
};

export default AddPhoto;
