import axios, { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";



const client = axios.create({
  baseURL: "https://reallikewp.test.boxygroup.hu",
  auth: {
    username: 'username',
    password: 'password'
  }
});

const getProducts = async (): Promise<AxiosResponse | null> => {
  try {
    const response = await client.get("/wp-json/wc/v3/products?per_page=100");
    return response;
  } catch (error) {
    return (error as AxiosError).response || null;
  }
};

const Product = z.object({
  id: z.number(),
  name: z.string(),
  sku: z.string(),
  variations: z.number().array(),
  meta_data: z.array(
    z.object({
      id: z.number(),
      key: z.string(),
      value: z.union([z.string(), z.object({})]),
    })
  ),
  images: z.object(
    {
      src: z.string()
    }
  ).array()
});

export type Products = z.infer<typeof Product>;

const validateProducts = (response: AxiosResponse): Products [] | null => {
  const result = Product.array().safeParse(response.data);
  if (!result.success) {
    console.log(result.error.issues);
    return null;
  }
  return result.data;
};

type Response<Type> =
  | {
      data: Type;
      status: number;
      success: true;
    }
  | {
      status: number;
      success: false;
    };

export const loadProducts = async (): Promise<Response<Products []>> => {
  const response = await getProducts();
  if (!response) return { success: false, status: 0 };
  if (response.status !== 200)
    return { success: false, status: response.status };
  const data = validateProducts(response);
  if (!data) return { success: false, status: response.status };
  return { success: true, status: response.status, data };
};