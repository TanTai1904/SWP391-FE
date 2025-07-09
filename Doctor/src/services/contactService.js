import api from "../services/api";

export const sendContact = async (data) => {
  // Giả sử backend có endpoint /api/Email/SendEmail
  return api.post("/Email/SendEmail", data);
};
