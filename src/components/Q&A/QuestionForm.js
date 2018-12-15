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

            <div className="card grey-text text-lighten-5 z-depth-0" style={{backgroundColor: "#7f2099", margin: 0,paddingTop: "1px", paddingBottom: "1px", paddingLeft: "30px", borderTopLeftRadius: "25px", borderBottomRightRadius: "25px"}}><h4>Ask A Question</h4></div>
            <Card actions={[<a href='#' className="teal-text text-lighten-1" onClick={this.handleSubmit.bind(this)}><b>Submit Question</b></a>]}>
                <div style={{color: "#999999"}}>
                    <div>
                        Name<br/>
                        <input type="text" onChange={this.onNameChange.bind(this)} placeholder="(Optional)" ref="name"/><br/>
                    </div>
                    <div>
                        <br/>
                        Subject<br/>
                        <input type="text" onChange={this.onSubjectChange.bind(this)} placeholder="Input the topic of your question."/>
                    </div>
                    <div>
                        <br/>
                        Question<br/><br/>
                        <textarea onChange={this.onQuestionChange.bind(this)} placeholder=" Input your question" style={{width:"100%", height:"300px"}} />
                    </div>
                </div>
            </Card>
            
        </div>
    );
  }
}

export default QuestionForm;
