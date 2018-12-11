import React, { Component } from 'react';
import axios from 'axios';

class QuestionForm extends Component {

    constructor(){
        super();

        this.state = {
            statement: ""
        }
    }

    componentDidMount(){

    }

    handleSubmit(e){

        const que = {
            question: String(this.refs.subject.value+"&SUBDIV&"+this.state.statement),
            askedBy: String(this.props.instance.getCurrentAccount()),
            askedByName: this.refs.name.value !== "" ? String(this.refs.name.value) : "Anonymous"
        };

        axios.post(`http://localhost:5000/api/question/create`, que)
        .then(res => {
            alert(res.data);
        })
        e.preventDefault();
    }

    onQuestionChange(evt){
        this.setState({statement: evt.target.value})
    }
    
    render() {

    return (
        <div className="QuestionForm">
            <h3>Ask A Question</h3>
            <div className="divider"></div>
            <br/>
            <form onSubmit={this.handleSubmit.bind(this)}>
            
                <div>
                    <label>Name:</label><br/>
                    <input type="text" placeholder="(Optional)" ref="name"/>
                </div>
                <div>
                    <label>Subject:</label><br/>
                    <input type="text" ref="subject"/>
                </div>
                <div>
                    <label>Question:</label><br/>
                    <textarea onChange={this.onQuestionChange.bind(this)} placeholder="Input your question" style={{width:"650px", height:"300px"}} />
                </div>
                <br/>
                <button type="submit">Submit</button>
            </form>    
        </div>
    );
  }
}

export default QuestionForm;
