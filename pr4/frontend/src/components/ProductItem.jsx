import React from 'react';

export default function ProductItem({ product, onEdit, onDelete }) {
    const imageUrl = product.image 
        ? `/images/${product.image}`
        : 'https://via.placeholder.com/60x60?text=No+Image';

    return (
        <div className="productRow">
            <div className="productImage">
                <img 
                    src={imageUrl}
                    alt={product.name}
                />
            </div>
            <div className="productMain">
                <div className="productName">{product.name}</div>
                <div className="productCategory">{product.category}</div>
                <div className="productPrice">{product.price} ₽</div>
                <div className="productStock">В наличии: {product.stock}</div>
                
                <div className="productDescription">
                    <strong>Описание:</strong> {product.description}
                </div>
            </div>
            <div className="productActions">
                <button className="btn" onClick={() => onEdit(product)}>
                    ✏️
                </button>
                <button className="btn btn--danger" onClick={() => onDelete(product.id)}>
                    🗑️
                </button>
            </div>
        </div>
    );
}