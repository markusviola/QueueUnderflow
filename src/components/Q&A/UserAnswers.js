import React, { Component } from 'react';
import UserAnswerItem from './UserAnswerItem';

class UserAnswers extends Component {

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
                    <UserAnswerItem instance = {this.props.instance} key={item.key} item = {item}/>
                )
            });
        }

    return (
        <div className="UserAnswers">
            <h3>Your Answers</h3>
            {process}
            {items}
        </div>
    );
  }
}

export default UserAnswers;
