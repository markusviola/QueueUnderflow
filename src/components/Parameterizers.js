import React, { Component } from 'react';
import moment from 'moment';
import ParameterizerItem from './ParameterizerItem'

class Parameterizers extends Component {

    constructor(){
        super();

        this.state = {
            currentParameterizers: []
        }
    }

    getProposalItems(){
        this.props.instance.paramGetAllParameterizers()
        .then((result) => {
            setTimeout(()=>{

                for(let i=0; i<result.length; i++){
                    
                    let updatedParameterizers = this.state.currentParameterizers;

                    updatedParameterizers.push({
                        key: i+1,
                        paramName: result[i].paramName,
                        paramVal: result[i].paramVal
                    })
                    this.setState({currentParameterizers: updatedParameterizers});
                }
            }, 1000)
        });
    }
    
    componentDidMount(){
        this.getProposalItems();
    }

    render() {
        
        let items;
        if(this.state.currentParameterizers){
            items = this.state.currentParameterizers.map(item => {
                return (
                    <ParameterizerItem key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Parameterizers">
            <h3>Parameterizers</h3>
            {items}
        </div>
    );
  }
}

export default Parameterizers;
