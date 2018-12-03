import React, { Component } from 'react';


class ParameterizerItem extends Component {

    constructor(){
        super();
    }

    render() {

    return (
        <div className="ParameterizerItem">
            <br/>
            <strong>{this.props.item.paramName}</strong><br/>
            Current Value: {this.props.item.paramVal}<br/>
            {this.props.item.proposalExpiry}
            <br/>
        </div>
    );
  }
}

export default ParameterizerItem;
