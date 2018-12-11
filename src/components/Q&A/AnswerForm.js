import React, { Component } from 'react';
import axios from 'axios';

class AnswerForm extends Component {

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
            answer: this.state.statement,
            answeredBy: this.props.instance.getCurrentAccount(),
            answeredByName: "Lunafreia",
            question_id: this.props.questionID
        };

        axios.post(`http://localhost:5000/api/answer/create`, que)
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
            <div className="AnswerForm">
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <div>
                        <label>Give your answer:</label><br/>
                        <textarea onChange={this.onAnswerChange.bind(this)} placeholder="Input your answer..." style={{width:"650px", height:"190px"}} />
                    </div>
                    <br/>
                    <button type="submit">Submit</button>
                </form>    
            </div>
        );
    }
}

export default AnswerForm;
