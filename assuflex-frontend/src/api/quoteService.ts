import API from "./baseAPI";

export const fetchClientQuotes = async () => {
  const res = await API.get("/quotes/client");
  return res.data;
};

export const deleteQuote = async (quoteId: string) => {
  const res = await API.delete(`/quotes/${quoteId}`);
  return res.data;
};

export const uploadFiles = async (quoteId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index + 1}`, file);
  });
  formData.append("quoteId", quoteId);

  const res = await API.post("/quotes/client/upload-documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
