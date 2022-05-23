import axios from "../api";

export const getPhotos = async (queryHistory) => {
  try {
    if (queryHistory.label && queryHistory.label !== "") {
      const res = await axios.get(`/all/null/null/${queryHistory.label}`);
      if (res.data.data.photos.length <= 0) {
        return null;
      }
      return res.data.data.photos;
    } else {
      const res = await axios.get(
        `/all/${queryHistory.firstQuery ? queryHistory.count : 0}/${
          queryHistory.firstQuery ? 5 : 6
        }/`
      );

      if (res.data.data.photos.length <= 0) {
        return null;
      }
      return res.data.data.photos;
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
