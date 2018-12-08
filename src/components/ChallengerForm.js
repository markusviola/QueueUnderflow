import React, { Component } from 'react';


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
            <h3>Challenge A Contender!</h3>
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div style={{width: "300px"}}>
                    <b><label>You are challenging {this.props.selectedContender.contender}!</label></b><br/><br/>
                </div>
                <div>
                    <label>Challenge Stake:</label><br/>
                    <input type="text" value={this.state.minDeposit} ref="stake" disabled/>
                </div>
                <div>
                    <label>Statement of Disapproval:</label><br/> 
                    <textarea onChange={this.onStatementChange.bind(this)} placeholder="Input evidence links..." style={{width:"450px", height:"200px"}} />
                </div>
                <br/>
                <button type="submit">Submit</button>
            </form>    
        </div>
    );
  }
}

export default ChallengerForm;
