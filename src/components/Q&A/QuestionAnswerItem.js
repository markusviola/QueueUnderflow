import React, { Component } from 'react';


class QuestionAnswerItem extends Component {

    constructor(){
        super();
    }

    render() {

    return (
        <div className="QuestionAnswerItem">
                <div style={{width: "600px"}}>
                    
                    <div className="row" style={{width: "920px"}}>
                        <div className="col s8">
                            <div style={{display:"flex", textAlign: "justify"}}>
                            {this.props.item.answer1}
                            </div><br/><br/>
                            <div className="divider"></div>
                        </div>
                        <div className="col s4">
                            <i class="small material-icons left teal-text text-lighten-1">person_pin</i><b>Answered by {this.props.item.answeredByName}</b>
                        </div>
                    </div>
                    
                </div>
                
            <br/>
            
        </div>
    );
  }
}

export default QuestionAnswerItem;
