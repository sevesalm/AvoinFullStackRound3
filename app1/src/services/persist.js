import axios from "axios";

const baseUrl = "/api/persons";

export default {
  getAll: () => axios.get(baseUrl).then(({ data }) => data),
  create: newRecord => axios.post(baseUrl, newRecord).then(({ data }) => data),
  delete: id => axios.delete(baseUrl + `/${id}`),
  update: (id, newRecord) =>
    axios.put(baseUrl + `/${id}`, newRecord).then(({ data }) => data)
};
