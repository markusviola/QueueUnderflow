import React, { Component } from 'react';
import QuestionItem from './QuestionItem';
import axios from 'axios';

class Questions extends Component {

    constructor(){
        super();

        this.state = {
            currentQuestions: []
        }
    }

    componentDidMount(){
        this.getQuestions();
    }

    async getQuestions(){
        axios.get(`http://localhost:5000/api/question`)
        .then(res => {
            const questions = res.data;
            this.setState({ currentQuestions: questions }, () => {console.log(this.state.currentQuestions)});
        })
    }

    handleQuestion(questionID){
        this.props.handleQuestion(questionID);
    }

    render() {

        
        let items;
        if(this.state.currentQuestions){
            items = this.state.currentQuestions.map(item => {
                return (
                    <QuestionItem handleQuestion = {this.handleQuestion.bind(this)} instance = {this.props.instance} key={item.questionId} item = {item}/>
                )
            });
        }

    return (
        <div className="Questions">
            <h3>Questions</h3>
            {items}
        </div>
    );
  }
}

export default Questions;
