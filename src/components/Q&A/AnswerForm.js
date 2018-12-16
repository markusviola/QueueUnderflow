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

        axios.post(`http://localhost:52009/api/answer/create`, que, config)
        .then(res => {
            if(res.data === "Success"){
                this.props.onAnswered(true);
                this.refs.ans_content.value = "";
            }
            else {
                this.props.onAnswered(false);
            }
            
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
                        <textarea onChange={this.onAnswerChange.bind(this)} ref="ans_content" placeholder="Write your answer here..." style={{marginTop: "5px", width:"650px", height:"190px"}} />
                    </div>
                    <a className="waves-effect waves-light btn" onClick={this.handleSubmit.bind(this)}>
                    <i className="material-icons right">create</i>Submit Answer</a>
            </div>
        );
    }
}

export default AnswerForm;
