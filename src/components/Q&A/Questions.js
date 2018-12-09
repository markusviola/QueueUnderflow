import React, { Component } from 'react';
import QuestionItem from './QuestionItem';

class Questions extends Component {

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
                    <QuestionItem instance = {this.props.instance} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="Questions">
            <h3>Questions</h3>
            {process}
            {items}
        </div>
    );
  }
}

export default Questions;
