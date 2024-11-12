import { useEffect, useState } from 'react'
import './App.css'
import { loadProducts } from './api/getProducts'
import { Products } from './api/getProducts'
import { postProductBoxy } from './api/ProductPostBoxy'

function App() {

  const [productDatas, setProductDatas] = useState<Products[] | null>()
  const [error, setError] = useState("")

  const getProducts = async () => {
    const response = await loadProducts()
    if (!response.success) {
      setError("A szerver nem elérhető")
    } else {
      setProductDatas(response.data)
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  const handlePostProduct = async (product: Products) => {
    const ean = product.meta_data.find((meta) => meta.key === "_alg_ean")?.value;
    
    const simplifiedProduct = {
      ean,
      sku: product.sku,
      name: product.name,
      isActive: true
    };

    try {
      const response = await postProductBoxy(simplifiedProduct);
      if (!response.success) {
        setError("Beküldés sikertelen");
      } else {
        alert("Beküldés sikeres");
      }
    } catch (error) {
      setError("Hiba történt a beküldés során");
    }
  };

  return (
    <div className="flex flex-wrap justify-center items-start gap-4">
      {productDatas?.map((product) => {
        return (
          <div key={product.id} className="card bg-base-100 w-96 h-96 shadow-xl flex flex-col">
            <figure className="flex-grow">
              {product.images.map((image) => (
                <img key={image.src} src={image.src} alt="" className="w-full h-full object-cover" />
              ))}
            </figure>
            <div className="card-body flex flex-col justify-between">
              <h2 className="card-title">{product.name}</h2>
              <p>ID: {product.id}</p>
              <p>SKU: {product.sku}</p>
              <p>
                {product.meta_data.filter((ean) => ean.key === "_alg_ean").map((ean) => {
                  const value = ean.value;
                  return typeof value === 'string' ? <p key={ean.key}>EAN: {value}</p> : null;
                })}
              </p>
              <button className="btn btn-primary" onClick={() => handlePostProduct(product)}>
                Beküldés
              </button>
            </div>
          </div>
        );
      })}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default App;
