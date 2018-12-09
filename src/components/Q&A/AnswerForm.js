import React, { Component } from 'react';


class AnswerForm extends Component {

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
        <div className="AnswerForm">
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div>
                    <label>Answer:</label><br/>
                    <textarea onChange={this.onQuestionChange.bind(this)} placeholder="Input your question" style={{width:"650px", height:"270px"}} />
                </div>
                <br/>
                <button type="submit">Submit</button>
            </form>    
        </div>
    );
  }
}

export default AnswerForm;
