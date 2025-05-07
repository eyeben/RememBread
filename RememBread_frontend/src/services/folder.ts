import http from "@/services/httpCommon";

// 루트 폴더 조회
export const getFolder = async () => {
  const response = await http.get("/folders");
  return response.data;
};

// 하위 폴더 조회
export const getSubFolder = async (folderId: number) => {
  const response = await http.get(`/folders/${folderId}/sub-folders`);
  return response.data;
};
