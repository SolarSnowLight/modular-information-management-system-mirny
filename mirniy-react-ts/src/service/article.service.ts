import {
  BadRequest,
  AuthResponse,
  LogoutResponse,
  userApi,
  UserRegister,
  CreateArticleResponse,
} from "../api/userApi";
import { AxiosError } from "axios";
import { ServiceData } from "./utils";

type ArticleServiceResponse = {
  is_created: boolean;
};

const createArticle = async (
  uploadData: FormData
): Promise<ServiceData<ArticleServiceResponse>> => {
  return userApi.createArticle(uploadData).then(
    (response) => {
      let { status, data } = response;
      if (status == 200) {
        data = data as CreateArticleResponse;

        return {
          data: {
            is_created: true,
          },
        };
      }

      return {
        data: {
          is_created: false,
        },
      };
    },
    (error: AxiosError) => {
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data as BadRequest;

        if (status === 400)
          return { error: { code: "error", message: data.message } };
        if (status === 401)
          return { error: { code: 401, message: data.message } };
        if (status === 500)
          return { error: { code: 500, message: data.message } };

        return { error: { code: "error", message: data.message } };
      }
      //console.log(error)
      // error.code: "ERR_NETWORK" when server not found on localhost - крч ошибка соединения с сервером
      return { error: { code: "connection error" } };
    }
  );
};

type ArticleFileServiceResponse = {
  index: number;
  filename: string;
  filepath: string;
};

type GetArticleServiceResponse = {
  title: string;
  text: string;
  files: ArticleFileServiceResponse[];
};

const getArticle = async (): Promise<ServiceData<GetArticleServiceResponse>> => {
  return userApi.getArticle().then(
    (response) => {
      let { status, data } = response;
      if (status == 200) {
        data = data as GetArticleServiceResponse;

        return data;
      }

      return {};
    }
  );
};

export const articleService = {
  createArticle,
  getArticle
};
