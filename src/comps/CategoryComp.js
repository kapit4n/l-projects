import React, { Component } from 'react';

class CategoryComp extends Component {
    render() {
        return (
            <div>
                {this.props.categories.map(category => {
                    if (this.props.selectedCats.find(cat => cat.name === category.name)) {
                        return <button style={{ background: 'green' }} className="category-view" key={category.id}
                            onClick={() => this.props.dropCategory(category)} >
                            {category.name}
                        </button>
                    } else {
                        return <button className="category-view" key={category.id}
                            onClick={() => this.props.addCategory(category)}>
                            {category.name}
                        </button>
                    }
                }
                )
                }
            </div>
        )
    }
}
export default CategoryComp;
