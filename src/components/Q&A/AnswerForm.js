import React, { Component } from 'react';
import axios from 'axios';

class AnswerForm extends Component {

    constructor(){
        super();

        this.state = {
            statement: ""
        }
    }

    handleSubmit(e){

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const que = {
            answer: String(this.state.statement),
            answeredBy: String(this.props.instance.getCurrentAccount()),
            answeredByName: String(this.props.currentChampions[0].contender),
            question_id: parseInt(this.props.questionID)
        };

        console.log("Statement: "+this.state.statement)
        console.log("Answered By: "+this.props.instance.getCurrentAccount())
        console.log("Answered By Name: "+this.props.currentChampions[0].contender)
        console.log("Question ID: "+this.props.questionID)

        axios.post(`http://localhost:5000/api/answer/create`, que, config)
        .then(res => {
            alert(res.data);
        })
        e.preventDefault();
    }

    onAnswerChange(evt){
        this.setState({statement: evt.target.value})
    }
    
    render() {
        return (
            <div className="AnswerForm" style={{paddingLeft: "10px"}}>
                    <div style={{marginBottom: "7px"}}>
                        Provide your answer:<br/>
                        <textarea onChange={this.onAnswerChange.bind(this)} placeholder="Write your answer here..." style={{marginTop: "5px", width:"650px", height:"190px"}} />
                    </div>
                    <a className="waves-effect waves-light btn" onClick={this.handleSubmit.bind(this)}>
                    <i className="material-icons right">create</i>Submit Answer</a>
            </div>
        );
    }
}

export default AnswerForm;
