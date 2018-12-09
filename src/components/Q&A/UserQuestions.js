import React, { Component } from 'react';
import UserQuestionItem from './UserQuestionItem';

class UserQuestions extends Component {

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
                    <UserQuestionItem instance = {this.props.instance} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="UserQuestions">
            <h3>Your Questions</h3>
            {process}
            {items}
        </div>
    );
  }
}

export default UserQuestions;
