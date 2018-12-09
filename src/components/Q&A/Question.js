import React, { Component } from 'react';
import QuestionAnswerItem from './QuestionAnswerItem';
import axios from 'axios';
import AnswerForm from './AnswerForm';


class Question extends Component {

    constructor(){
        super();

        this.state = {
            currentAnswers: [],
            questionDetails: {}
        }

    }

    async getQuestion(){
        axios.get(`http://localhost:5000/api/question/id/`+this.props.selectedQuestion)
        .then(res => {
            this.setState({questionDetails: res.data})
        })

        axios.get(`http://localhost:5000/api/answer/question/id/`+this.props.selectedQuestion)
        .then(res => {
            this.setState({currentAnswers: res.data})
        })

        
    }

    componentDidMount(){
        
        this.getQuestion();
    }

    render() {

        
        let items;
        if(this.state.currentAnswers){
            items = this.state.currentAnswers.map(item => {
                return (
                    <QuestionAnswerItem instance = {this.props.instance} key={item.answerId} item = {item}/>
                )
            });
        }

        let contents = []

        if(Object.keys(this.state.questionDetails).length !== 0){
            contents = this.state.questionDetails.question1.split("&SUBDIV&");
        }
        

    return (
        <div className="Question">
            <h3>{contents[0]}</h3> 
            <br/>         
            <div style={{width: "700px", display: "flex", justifyContent: "space-between", textAlign: "justify"}}>
                {contents[1]}
            </div>
            <br/>
            <div>By {this.state.questionDetails.askedByName}</div>
            <br/><br/>{items}<br/><br/>
            <AnswerForm instance = {this.props.instance} currentContenders = {this.props.currentContenders}/>
        </div>
       
    );
  }
}

export default Question;
