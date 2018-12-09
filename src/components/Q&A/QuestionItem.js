import React, { Component } from 'react';


class QuestionItem extends Component {

    constructor(){
        super();
    }

    onQuestionClicked(){
        this.props.handleQuestion(this.props.item.questionId);
    }
    render() {

        let contents = this.props.item.question1.split("&SUBDIV&")

    return (
        <div className="QuestionItem">
            <br/>
                <a href="#" onClick={this.onQuestionClicked.bind(this)}>
                    {contents[0]}<br/>
                </a>
                <div style={{width: "700px", display: "flex", justifyContent: "space-between"}}>
                    {contents[1].substring(0,60)}
                    <div>By {this.props.item.askedByName}</div>
                </div>
                
            <br/>
        </div>
    );
  }
}

export default QuestionItem;
