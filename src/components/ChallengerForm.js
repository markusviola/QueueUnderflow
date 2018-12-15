import React, { Component } from 'react';
import {Card} from 'react-materialize';

class ChallengerForm extends Component {

    constructor(){
        super();

        this.state = {
            minDeposit: "Calculating...",
            statement: ""
        }
    }

    componentDidMount(){
        this.props.instance.paramGet("minDeposit")
        .then((_minDeposit)=>{
            this.setState({
                minDeposit: _minDeposit,
            });
        })
    }

    handleSubmit(e){
        this.props.instance.registryChallenge(this.props.selectedContender.contenderHash, this.state.statement)
        .then((isTransaction) => {
            this.props.onProcess(isTransaction);
        });
        e.preventDefault();
    }

    onStatementChange(evt){
        this.setState({statement: evt.target.value})
    }
    
    render() {

    return (
        <div className="ChallengerForm">
            <div className="card grey-text text-lighten-5 z-depth-0" style={{backgroundColor: "#7f2099", margin: 0,paddingTop: "1px", paddingBottom: "1px", paddingLeft: "30px", borderTopLeftRadius: "25px", borderBottomRightRadius: "25px"}}><h4>Challenge An Applicant</h4></div>
            <Card actions={[<a href='#' className="teal-text text-lighten-1" onClick={this.handleSubmit.bind(this)}><b>Confirm Challenge</b></a>]}>
                <div style={{color: "#999999"}}>
                    <div>
                        Challenged Applicant:<br/>
                        <input type="text" value={this.props.selectedContender.contender} readOnly/>
                    </div>
                    <div><br/>
                        Challenge Stake:<br/>
                        <input type="text" value={this.state.minDeposit} readOnly/>
                    </div>
                    <div><br/>
                        Statement of Disapproval:<br/><br/>
                        <textarea onChange={this.onStatementChange.bind(this)} placeholder=" Input any evidence or links..." style={{width:"100%", height:"200px"}} />
                    </div>
                </div>
            </Card>
        </div>


        
    );
  }
}

export default ChallengerForm;
