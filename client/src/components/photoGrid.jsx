import { useRef } from "react";
import classes from "./css/photogrid.module.css";
import Photo from "./photo";

const PhotoGrid = ({ photos }) => {
  const currentIteration = useRef({ value: 0 });
  const photoLists = useRef([]);

  (() => {
    const lists = [[], [], []];
    photos.forEach((entry) => {
      if (currentIteration.current.value === 3) {
        currentIteration.current.value = 0;
      }
      lists[currentIteration.current.value].push(entry);
      currentIteration.current.value += 1;
    });
    photoLists.current = lists;
  })();

  return (
    <div className={classes.section}>
      <div className={classes.container}>
        <div className={classes.photoGrid}>
          {photoLists.current.map((list, index) => {
            return (
              <div className={classes.photoCol} key={index}>
                {list.map((photo) => {
                  return <Photo photo={photo} key={photo._id} />;
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PhotoGrid;
