import React, { Component } from 'react';

class CategoryComp extends Component {
    render() {
        return (
            <div>
                {this.props.categories.map(category =>
                    <button className="category-view" key={category.id}>
                       {category.name}
                    </button>
                )
                }
            </div>
        )
    }
}
export default CategoryComp;
