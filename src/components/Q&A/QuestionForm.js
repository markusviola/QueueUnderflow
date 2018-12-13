import React, { Component } from 'react';
import axios from 'axios';
import {Col, Card} from 'react-materialize';

class QuestionForm extends Component {

    constructor(){
        super();

        this.state = {
            statement: "",
            name: "",
            subject: ""
        }
    }

    componentDidMount(){
        
    }

    handleSubmit(e){

        const que = {
            question: String(this.state.subject+"&SUBDIV&"+this.state.statement),
            askedBy: String(this.props.instance.getCurrentAccount()),
            askedByName: this.state.name !== "" ? String(this.state.name) : "Anonymous"
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

    onNameChange(evt){
        this.setState({name: evt.target.value})
    }

    onSubjectChange(evt){
        this.setState({subject: evt.target.value})
    }
    
    render() {

    return (
        <div className="QuestionForm">
            <Col m={7} s={12}>
                <Card actions={[<a href='#' className="orange-text text-darken-2" onClick={this.handleSubmit.bind(this)}><b>Submit Question</b></a>]}>
                <h4>Ask A Question!</h4>
                    <div className="divider"></div>
                    <br/>
                    <div>
                        <label>Name:</label><br/>
                        <input type="text" onChange={this.onNameChange.bind(this)} placeholder="(Optional)" ref="name"/>
                    </div>
                    <div>
                        <label>Subject:</label><br/>
                        <input type="text" onChange={this.onSubjectChange.bind(this)}/>
                    </div>
                    <div>
                        <br/>
                        <label>Question:</label><br/>
                        <textarea onChange={this.onQuestionChange.bind(this)} placeholder=" Input your question" style={{width:"100%", height:"300px"}} />
                    </div>
                    <br/>
                </Card>
            </Col>
            
        </div>
    );
  }
}

export default QuestionForm;
