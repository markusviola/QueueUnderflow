import React, { Component } from 'react';
import QuestionAnswerItem from './QuestionAnswerItem';
import axios from 'axios';
import AnswerForm from './AnswerForm';


class Question extends Component {

    constructor(){
        super();

        this.state = {
            currentAnswers: [],
            questionDetails: {},
            userChampions: []
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

    async getChampionDetails(){
        
        let champions = await this.props.currentContenders.filter((item) => {
            return (item.contender === "" || (!item.isChampion || !(item.issuer === this.props.instance.getCurrentAccount()))) ? false: true})

        this.setState({
            userChampions: champions
        },() => {
            console.log(this.state.userChampions);
        })

    }

    componentDidMount(){
        this.getQuestion();
        this.getChampionDetails();
        
    }

    render() {

        let items;
        let answerForm = <div style={{paddingLeft: "10px", display: "flex", justifyItems: "space-between", alignItems: "center"}}>
                            <div><i class="small material-icons">report</i></div>
                            <div><div style={{paddingLeft: "10px"}}><b>Only a consultant can answer questions.</b></div></div>
                        </div>

        if(this.state.userChampions.length > 0){
            answerForm = <div><div style={{display: "flex", justifyItems: "space-between", alignItems: "center"}}>
                            <div>
                                <i class="medium material-icons teal-text text-lighten-1">person_pin</i>
                            </div>
                            <div>
                                <b style={{fontSize: "18px"}}>{this.state.userChampions[0].contender}</b><br/>
                                Authorized Consultant<br/>
                            </div>
                            
                            </div>
                            <AnswerForm questionID = {this.props.selectedQuestion} instance = {this.props.instance} currentChampions = {this.state.userChampions}/>
                        </div>
        }

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
        <div className="Question" style={{color: "#666666"}}>
            <div className="purple-text text-darken-1"><h5><b>Question</b></h5></div>
            <h4 style={{margin: "0", padding: "0", marginBottom: "10px"}}><b>{contents[0]}</b></h4> 
            <div className="divider" style={{height: "2px"}}></div>
            <br/>         
            <div style={{width: "100%", display: "flex", justifyContent: "space-between", textAlign: "justify"}}>
                {contents[1]}
            </div>
            <br/><br/>
            <div className="right-align"><i class="small material-icons right purple-text text-darken-1">person_pin</i>By {this.state.questionDetails.askedByName}</div>           
            <br/>
            <div className="divider" style={{height: "2px"}}></div>
            <br/>{items}<br/>
            <br/>
            
            {answerForm}
        </div>
       
    );
  }
}

export default Question;
