import React, { Component } from 'react';


class QuestionAnswerItem extends Component {

    constructor(){
        super();
    }

    render() {

    return (
        <div className="QuestionAnswerItem">
            <br/>
                <strong>Answered by {this.props.item.answeredByName}</strong><br/><br/>
                <div style={{width: "400px", display:"flex", textAlign: "justify"}}>{this.props.item.answer1}</div>
            <br/>
        </div>
    );
  }
}

export default QuestionAnswerItem;
