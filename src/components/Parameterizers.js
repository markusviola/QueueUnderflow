import React, { Component } from 'react';
import ParameterizerItem from './ParameterizerItem'

class Parameterizers extends Component {

    constructor(){
        super();

    }

    render() {

        let process = "";

        if(this.props.dataStatus === true){
            process = <img id="process" src="https://loading.io/spinners/double-ring/lg.double-ring-spinner.gif" style={{width: "50px"}}/>
        }
        
        let items;
        if(this.props.currentParameterizers){
            items = this.props.currentParameterizers.map(item => {
                return (
                    <ParameterizerItem instance = {this.props.instance} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Parameterizers">
            <h3>Parameterizers</h3>
            <div className="divider"></div>
            <br/>
            {process}
            {items}
        </div>
    );
  }
}

export default Parameterizers;
