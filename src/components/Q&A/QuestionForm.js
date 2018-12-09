import React, { Component } from 'react';


class QuestionForm extends Component {

    constructor(){
        super();

        this.state = {
        }
    }

    componentDidMount(){
    }

    handleSubmit(e){
    }

    onQuestionChange(evt){
        this.setState({statement: evt.target.value})
    }
    
    render() {

    return (
        <div className="QuestionForm">
            <h3>As A Question</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
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
