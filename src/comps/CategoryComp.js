import React, { Component } from 'react';

class CategoryComp extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                {this.props.categories.map(category =>
                    <button className="category-view">
                       {category.name}
                    </button>
                )
                }
            </div>
        )
    }
}
export default CategoryComp;
