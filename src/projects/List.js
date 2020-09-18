import React from 'react';

export default function List({ categories, addCategory, dropCategory, selectedCats }) {
  return (
    <div>
      {categories.map(category => {
        if (selectedCats.find(cat => cat.name === category.name)) {
          return <button style={{ background: 'green' }} className="category-view" key={category.id}
            onClick={() => dropCategory(category)} >
            {category.name}
          </button>
        } else {
          return <button className="category-view" key={category.id}
            onClick={() => addCategory(category)}>
            {category.name}
          </button>
        }
      }
      )
      }
    </div>
  )
}

