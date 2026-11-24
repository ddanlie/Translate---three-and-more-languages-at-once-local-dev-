import type { AxiosRequestConfig, AxiosProgressEvent } from "axios";
import axiosInstance from "./axios_instance";

export type RequestConfig = AxiosRequestConfig;
export type ProgressCallback = (progress: number) => void;

// GET request
export const getData = async <T = unknown>(
  url: string,
  config: RequestConfig = {}
): Promise<T> => {
  const { params, ...axiosConfig } = config;
  const response = await axiosInstance.get<T>(url, {
    params,
    ...axiosConfig,
  });
  return response.data;
};

// POST request
export const postData = async <T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: RequestConfig
): Promise<T> => {
  const { data } = await axiosInstance.post<T>(url, body, config);
  return data;
};

// PUT request
export const putData = async <T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: RequestConfig
): Promise<T> => {
  const { data } = await axiosInstance.put<T>(url, body, config);
  return data;
};

// PATCH request
export const patchData = async <T = unknown, B = unknown>(
  url: string,
  body?: B,
  config?: RequestConfig
): Promise<T> => {
  const { data } = await axiosInstance.patch<T>(url, body, config);
  return data;
};

// DELETE request
export const deleteData = async <T = unknown>(
  url: string,
  config?: RequestConfig
): Promise<T> => {
  const { data } = await axiosInstance.delete<T>(url, config);
  return data;
};

// UPLOAD file(s) with multipart/form-data
export const uploadFile = async <T = unknown>(
  url: string,
  files: File | File[],
  additionalData: Record<string, string | Blob> = {},
  onProgress: ProgressCallback | null = null
): Promise<T> => {
  const formData = new FormData();

  if (Array.isArray(files)) {
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
  } else {
    formData.append("file", files);
  }

  Object.entries(additionalData).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const config: RequestConfig = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  };

  if (onProgress) {
    config.onUploadProgress = (event: AxiosProgressEvent) => {
      const total = event.total ?? 0;
      const progress = total > 0 ? (event.loaded * 100) / total : 0;
      onProgress(progress / 100); // 0-1 range
    };
  }

  return postData<T>(url, formData, config);
};