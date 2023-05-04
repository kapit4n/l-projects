import React from 'react';
import './ProjectCategory.css'

export const ProjectCategory = ({ categories, selectedCats, addCategory, dropCategory }) => {
  return (
    <div className='category-view'>
      {categories.map(category => {
        if (selectedCats.some(cat => cat === category)) {
          return <button className="category-button" key={category}
            onClick={() => dropCategory(category)} >
            {category}
          </button>
        } else {
          return <button className="category-button-selected" key={category}
            onClick={() => addCategory(category)}>
            {category}
          </button>
        }
      })
      }
    </div>
  )
}
export default ProjectCategory;
