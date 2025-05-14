import http from "@/services/httpCommon";

export const getRoutes = async (cardSetId: number, page: number, size: number) => {
  const response = await http.get(`/studies/${cardSetId}/routes`, { params: { page, size } });
  return response.data;
};
