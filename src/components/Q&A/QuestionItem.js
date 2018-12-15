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
                <a href="#" className = "teal-text text-lighten-1" onClick={this.onQuestionClicked.bind(this)}>
                <b>{contents[0]}</b><br/>
                </a>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    {contents[1].substring(0,60)}
                    <div><i class="material-icons right purple-text text-darken-1">person_pin</i>By {this.props.item.askedByName}</div>
                </div>
            <br/>
            <div className="divider"></div>
        </div>
    );
  }
}

export default QuestionItem;
