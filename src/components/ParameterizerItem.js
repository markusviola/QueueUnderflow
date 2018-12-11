import React, { Component } from 'react';


class ParameterizerItem extends Component {

    constructor(){
        super();
    }

    render() {

    return (
        <div className="ParameterizerItem">
            <br/>
            <strong>{this.props.instance.getFullParamName(this.props.item.paramName)}</strong><br/>
            ({this.props.item.paramName})<br/>
            Current Value: {this.props.item.paramVal}<br/>
            {this.props.item.proposalExpiry}
            <br/>
            <div className="divider"></div>
        </div>
    );
  }
}

export default ParameterizerItem;
