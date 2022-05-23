import { useState } from "react";
import classes from "./css/photo.module.css";
import DeletePhoto from "./DeletePhoto";

const Photo = ({ photo }) => {
  const [deleteId, setDeleteId] = useState(null);

  return (
    <>
      {deleteId && (
        <DeletePhoto closeModal={() => setDeleteId(null)} photoId={photo._id} />
      )}
      <div className={classes.photo}>
        <button
          className={classes.delete}
          onClick={() => setDeleteId(photo._id)}
        >
          Delete
        </button>
        <img src={photo.photoUrl} alt={photo.label} />
        <h2 className={classes.label}>{photo.label}</h2>
      </div>
    </>
  );
};

export default Photo;
