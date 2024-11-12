import axios, { AxiosError, AxiosResponse } from "axios"
import { object, z } from "zod"

const client = axios.create({
    baseURL: "https://api-test.apps.boxygroup.hu/"
})

const auth = {
    headers: {
        'Content-Type': 'application/json',
        "x-boxy-api-token-id": "Felhasználó",
        "x-boxy-api-token-secret": "Jelszó"
    }
};

const _postProductBoxy = async (product: object): Promise<AxiosResponse | null> => {
    try {
        const response = await client.post("/api/Article/save", product, { headers: auth.headers })
        return response
    } catch (error) {
        return (error as AxiosError).response || null
    }
}

const ProductBoxySchema = z.object({
    product: object(
        {
            ean: z.string(),
            sku: z.string(),
            name: z.string(),
            isActive: z.boolean()   
        }
    )
})

export type ProductBoxy = z.infer<typeof ProductBoxySchema>

const validateProductBoxy = (response: AxiosResponse): ProductBoxy | null => {
    const result = ProductBoxySchema.safeParse(response.data)
    if (!result.success) {
        return null
    }
    return result.data
}

type Response<Type> = {
    data: Type
    status: number
    success: true
} | {
    status: number
    success: false
}

export const postProductBoxy = async (product: object): Promise<Response<ProductBoxy>> => {
    const response = await _postProductBoxy(product)
    if (!response)
        return { success: false, status: 0 }
    if (response.status !== 200)
        return { success: false, status: response.status }
    const data = validateProductBoxy(response)
    if (!data)
        return { success: false, status: response.status }
    return { success: true, status: response.status, data }
}