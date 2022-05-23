import { createPortal } from "react-dom";
import classes from "./css/deletephoto.module.css";
import axios from "../api";
import { XIcon } from "@heroicons/react/solid";

const DeletePhoto = ({ photoId, closeModal }) => {
  const submitHandler = async (e) => {
    e.preventDefault();
    const password = e.target.children[2].value;
    if (password !== "password") throw new Error("Not Authenticated");
    try {
      const res = await axios.delete(`/delete/${photoId}`);
      window.location.reload();
    } catch (error) {}
  };

  return createPortal(
    <div className={classes.back}>
      <form onSubmit={submitHandler} className={classes.modal}>
        <div className={classes.heading}>
          <h2>Delete Photo</h2>
          <button className={classes.cross} onClick={closeModal}>
            <XIcon />
          </button>
        </div>
        <label htmlFor="password">Password</label>
        <input type="text" id="password" />
        <button type="submit">Delete</button>
      </form>
    </div>,
    document.body
  );
};

export default DeletePhoto;
