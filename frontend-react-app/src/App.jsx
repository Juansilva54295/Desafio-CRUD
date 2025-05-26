import React, { useState, useEffect } from 'react';

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addProductName, setAddProductName] = useState('');
  const [addProductDescription, setAddProductDescription] = useState('');
  const [addProductPrice, setAddProductPrice] = useState('');
  const [updateProductId, setUpdateProductId] = useState('');
  const [updateProductName, setUpdateProductName] = useState('');
  const [updateProductDescription, setUpdateProductDescription] = useState('');
  const [updateProductPrice, setUpdateProductPrice] = useState('');
  const [searchProductId, setSearchProductId] = useState('');
  const [deleteProductId, setDeleteProductId] = useState('');

 const API_URL = 'http://localhost:5158/api/products';

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      alert("Erro ao carregar produtos. Verifique o console para mais detalhes.");
    }
  };

  const addProduct = async () => {
    const newProduct = {
      name: addProductName,
      description: addProductDescription,
      price: parseFloat(addProductPrice),
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      alert('Produto adicionado com sucesso!');
      fetchProducts(); 
      setAddProductName('');
      setAddProductDescription('');
      setAddProductPrice('');
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      alert("Erro ao adicionar produto. Verifique o console para mais detalhes.");
    }
  };

  const getProduct = async () => {
    if (!searchProductId) {
      alert("Por favor, insira um ID para buscar.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${searchProductId}`);
      if (response.status === 404) {
        setSelectedProduct(null);
        alert('Produto não encontrado!');
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSelectedProduct(data);
      setUpdateProductId(data.id);
      setUpdateProductName(data.name);
      setUpdateProductDescription(data.description);
      setUpdateProductPrice(data.price);
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      alert("Erro ao buscar produto. Verifique o console para mais detalhes.");
    }
  };

  const updateProduct = async () => {
    if (!updateProductId) {
      alert("Por favor, insira um ID para atualizar.");
      return;
    }
    const updatedProduct = {
      id: parseInt(updateProductId), 
      name: updateProductName,
      description: updateProductDescription,
      price: parseFloat(updateProductPrice),
    };

    try {
      const response = await fetch(`${API_URL}/${updateProductId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.status === 204) { 
        alert('Produto atualizado com sucesso!');
        fetchProducts();
        setUpdateProductId('');
        setUpdateProductName('');
        setUpdateProductDescription('');
        setUpdateProductPrice('');
        setSelectedProduct(null); 
      } else if (response.status === 400) {
        const errorText = await response.text();
        alert(`Erro de requisição: ${errorText}`);
      } else if (response.status === 404) {
        alert('Produto não encontrado para atualização.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      alert("Erro ao atualizar produto. Verifique o console para mais detalhes.");
    }
  };

  
  const deleteProduct = async () => {
    if (!deleteProductId) {
      alert("Por favor, insira um ID para deletar.");
      return;
    }
    try {
      const response = await fetch(`${API_URL}/${deleteProductId}`, {
        method: 'DELETE',
      });

      if (response.status === 204) { 
        alert('Produto deletado com sucesso!');
        fetchProducts(); 
        setDeleteProductId('');
      } else if (response.status === 404) {
        alert('Produto não encontrado para deletar.');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
      alert("Erro ao deletar produto. Verifique o console para mais detalhes.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">CRUD de Produtos com React e .NET API</h1>
        <section className="mb-8 p-4 border border-gray-200 rounded-lg bg-blue-50">
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">Adicionar Novo Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="add-name" className="block text-gray-700 text-sm font-bold mb-2">Nome:</label>
              <input
                type="text"
                id="add-name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={addProductName}
                onChange={(e) => setAddProductName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="add-description" className="block text-gray-700 text-sm font-bold mb-2">Descrição:</label>
              <input
                type="text"
                id="add-description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={addProductDescription}
                onChange={(e) => setAddProductDescription(e.target.value)}
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="add-price" className="block text-gray-700 text-sm font-bold mb-2">Preço:</label>
              <input
                type="number"
                id="add-price"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={addProductPrice}
                onChange={(e) => setAddProductPrice(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={addProduct}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Adicionar Produto
          </button>
        </section>

        <section className="mb-8 p-4 border border-gray-200 rounded-lg bg-green-50">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">Lista de Produtos</h2>
          <button
            onClick={fetchProducts}
            className="mb-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Atualizar Lista
          </button>
          <ul className="space-y-2">
            {products.length > 0 ? (
              products.map((product) => (
                <li key={product.id} className="bg-white p-3 rounded-md shadow-sm border border-gray-100 flex justify-between items-center">
                  <span className="text-gray-800">
                    ID: {product.id} | Nome: {product.name} | Preço: R$ {product.price ? product.price.toFixed(2) : 'N/A'}
                  </span>
                </li>
              ))
            ) : (
              <p className="text-gray-600">Nenhum produto cadastrado.</p>
            )}
          </ul>
        </section>

        <section className="mb-8 p-4 border border-gray-200 rounded-lg bg-yellow-50">
          <h2 className="text-2xl font-semibold text-yellow-700 mb-4">Buscar Produto por ID</h2>
          <div className="flex items-center space-x-4 mb-4">
            <label htmlFor="search-id" className="text-gray-700 text-sm font-bold">ID:</label>
            <input
              type="number"
              id="search-id"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-32"
              value={searchProductId}
              onChange={(e) => setSearchProductId(e.target.value)}
            />
            <button
              onClick={getProduct}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            >
              Buscar
            </button>
          </div>
          {selectedProduct && (
            <div className="bg-white p-3 rounded-md shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-800">Detalhes do Produto:</h3>
              <p>ID: {selectedProduct.id}</p>
              <p>Nome: {selectedProduct.name}</p>
              <p>Descrição: {selectedProduct.description}</p>
              <p>Preço: R$ {selectedProduct.price ? selectedProduct.price.toFixed(2) : 'N/A'}</p>
            </div>
          )}
        </section>

        <section className="mb-8 p-4 border border-gray-200 rounded-lg bg-purple-50">
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">Atualizar Produto</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="update-id" className="block text-gray-700 text-sm font-bold mb-2">ID do Produto:</label>
              <input
                type="number"
                id="update-id"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={updateProductId}
                onChange={(e) => setUpdateProductId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="update-name" className="block text-gray-700 text-sm font-bold mb-2">Novo Nome:</label>
              <input
                type="text"
                id="update-name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={updateProductName}
                onChange={(e) => setUpdateProductName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="update-description" className="block text-gray-700 text-sm font-bold mb-2">Nova Descrição:</label>
              <input
                type="text"
                id="update-description"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={updateProductDescription}
                onChange={(e) => setUpdateProductDescription(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="update-price" className="block text-gray-700 text-sm font-bold mb-2">Novo Preço:</label>
              <input
                type="number"
                id="update-price"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={updateProductPrice}
                onChange={(e) => setUpdateProductPrice(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={updateProduct}
            className="mt-4 bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Atualizar Produto
          </button>
        </section>

        <section className="p-4 border border-gray-200 rounded-lg bg-red-50">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">Deletar Produto</h2>
          <div className="flex items-center space-x-4">
            <label htmlFor="delete-id" className="text-gray-700 text-sm font-bold">ID do Produto:</label>
            <input
              type="number"
              id="delete-id"
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-32"
              value={deleteProductId}
              onChange={(e) => setDeleteProductId(e.target.value)}
            />
            <button
              onClick={deleteProduct}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
            >
              Deletar Produto
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
