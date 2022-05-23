import axios from "axios";

const baseURL = "https://image-library.herokuapp.com/";

export default axios.create({
  baseURL,
});
