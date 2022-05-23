import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import AddPhoto from "./components/AddPhoto";
import Header from "./components/header";
import PhotoGrid from "./components/photoGrid";
import { getPhotos } from "./utils/getPhotos";
import inifinite from "./inifinity.svg";

const Reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case "loading":
      return { ...state, isLoading: payload };
    case "addPhoto":
      return { ...state, addPhoto: !state.addPhoto };
  }
};

const initialQuery = {
  count: 0,
  firstQuery: false,
  label: "",
  hasMore: true,
};

function App() {
  const [photos, setPhotos] = useState([]);
  const [queryHistory, setQueryHistory] = useState(initialQuery);

  const [appState, dispatch] = useReducer(Reducer, {
    isLoading: true,
    addPhoto: false,
  });

  const observer = useRef();
  const callbackForNode = useCallback(
    (node) => {
      if (appState.isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && queryHistory.hasMore) {
          (async () => {
            const resPhotos = await getPhotos(queryHistory);
            if (!resPhotos) {
              setQueryHistory((prev) => ({ ...prev, hasMore: false }));
              return;
            }
            setPhotos((prev) => {
              const photosArray = [...prev, ...resPhotos];
              return [...new Set(photosArray.map((photo) => photo._id))].map(
                (id) => ({
                  ...photosArray.find((p) => p._id === id),
                })
              );
            });
          })();
        }
      });
      if (node) observer.current.observe(node);
    },
    [appState.isLoading, queryHistory]
  );

  useEffect(() => {
    setQueryHistory((prev) => ({
      ...prev,
      count: photos.length,
    }));
  }, [photos]);

  useEffect(() => {
    (async () => {
      try {
        dispatch({ type: "loading", payload: true });
        const photos = await getPhotos(queryHistory);
        setPhotos(photos);
        setQueryHistory((prev) => ({ ...prev, firstQuery: true }));
        dispatch({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        setPhotos([]);
      }
    })();
  }, []);
  useEffect(() => {
    if (queryHistory.label !== "") {
      setQueryHistory((prev) => ({ ...prev, hasMore: false }));
    } else {
      setQueryHistory((prev) => ({
        ...prev,
        hasMore: true,
        firstQuery: true,
        count: 0,
      }));
    }
    (async () => {
      try {
        dispatch({ type: "loading", payload: true });
        const photos = await getPhotos({ ...queryHistory, firstQuery: false });
        setPhotos(photos);
        dispatch({ type: "loading", payload: false });
      } catch (error) {
        console.log(error);
        setPhotos([]);
      }
    })();
  }, [queryHistory.label]);

  return (
    <div className="App">
      {appState.addPhoto && (
        <AddPhoto closeModal={() => dispatch({ type: "addPhoto" })} />
      )}
      <Header
        clickButton={() => dispatch({ type: "addPhoto" })}
        value={queryHistory.label}
        setValue={(label) => setQueryHistory((prev) => ({ ...prev, label }))}
      />
      {appState.isLoading && (
        <div className="loading">
          <img src={inifinite} alt="" />
        </div>
      )}
      {!appState.isLoading && (
        <>
          {!photos && <h2>Cant find any results.</h2>}
          {photos && photos.length && <PhotoGrid photos={photos} />}
          <div
            ref={callbackForNode}
            style={{
              visibility: "hidden",
              marginBottom: "1rem",
              marginTop: "2rem",
            }}
          >
            Observer Container
          </div>
        </>
      )}
    </div>
  );
}

export default App;
