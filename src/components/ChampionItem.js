import React, { Component } from 'react';


class ChampionItem extends Component {

    onChallengeClicked(){
        this.props.challengeClicked(this.props.item);
    }

    render() {

        let challengeButton = "";
        if(this.props.item.isConcluded){
            challengeButton = <div className="z-depth-0"><a className="waves-effect waves-light teal-text text-lighten-1" onClick={this.onChallengeClicked.bind(this)}>
            <i className="tiny material-icons right">thumb_down</i><b>Challenge</b></a></div>;
        }
        else challengeButton = <div>Being challenged!</div>
        
                
    return (
        <div className="ChampionItem" style={{color: "#666666"}}>
            <br/>
            <b>{this.props.item.contender}</b><br/>
            {challengeButton}
            <br/>
            <div className="divider"></div>
        </div>
    );
  }
}

export default ChampionItem;
