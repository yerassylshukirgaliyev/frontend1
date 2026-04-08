import { useEffect, useState } from "react"
import axios from "axios"

function Products() {
  const [products, setProducts] = useState([]) 
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")  
  const [categories, setCategories] = useState([])
  const [categoryId, setCategoryId] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState("")
  const [editPrice, setEditPrice] = useState("") 
  const [editCategoryId, setEditCategoryId] = useState("")

  // Загрузка продуктов и категорий
  useEffect(() => {
    axios.get("http://localhost:3000/products")
      .then(res => setProducts(res.data)) 

    axios.get("http://localhost:3000/categories")
      .then(res => setCategories(res.data))
  }, []) 

  // Добавление продукта
  const addProduct = () => {
    if (!title || !price || !categoryId) {
      return alert("Заполни все поля!")
    }

    axios.post("http://localhost:3000/products", {
      title,
      price: Number(price),
      categoryId: Number(categoryId)
    }).then(res => {
      setProducts([...products, res.data])
      setTitle("")
      setPrice("")
      setCategoryId("")
    })
  }

  // Начало редактирования
  const startEdit = (product) => {
    setEditingId(product.id)
    setEditTitle(product.title)
    setEditPrice(product.price)
    setEditCategoryId(product.categoryId)
  }

  // Сохранение изменений
  const updateProduct = (id) => {
    if (!editTitle || !editPrice || !editCategoryId) {
      return alert("Заполни все поля!")
    }

    axios.put(`http://localhost:3000/products/${id}`, {
      id,
      title: editTitle,
      price: Number(editPrice),
      categoryId: Number(editCategoryId)
    }).then(() => {
      setProducts(products.map(p =>
        p.id === id
          ? {
              ...p,
              title: editTitle,
              price: Number(editPrice),
              categoryId: Number(editCategoryId)
            }
          : p
      ))
      setEditingId(null)
    })
  }

  // Удаление продукта
  const deleteProduct = (id) => {
    axios.delete(`http://localhost:3000/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id))
      })
  }

  // Получение названия категории по id
  const getCategoryName = (id) => {
    if (!categories || categories.length === 0) return ""
    const cat = categories.find(c => c.id == Number(id))
    console.log("Category is: ", cat)
    return cat ? cat.name : ""
  }

  return (
    <div>
      <h1>Products</h1> 

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      /> 

      <select
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Select category</option>
        {categories.map(cat => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button onClick={addProduct}>Add Product</button>

      <hr />

      {products.map(product => (
        <div key={product.id} style={{ marginBottom: "20px" }}>
          {editingId === product.id ? (
            <>
              <select
                value={editCategoryId}
                onChange={(e) => setEditCategoryId(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <input
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />

              <button onClick={() => updateProduct(product.id)}>Save</button>
            </>
          ) : (
            <>
              <h3>{product.title}</h3>
              <p>{product.price}$</p>
              <p>Category: {getCategoryName(product.categoryId)}</p>

              <button onClick={() => startEdit(product)}>Edit</button>
              <button onClick={() => deleteProduct(product.id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}

export default Products
