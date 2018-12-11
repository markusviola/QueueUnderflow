import React, { Component } from 'react';


class ChampionItem extends Component {

    onChallengeClicked(){
        this.props.challengeClicked(this.props.item);
    }

    render() {

        let challengeButton = "";
        if(this.props.item.isConcluded){
            challengeButton = <div><button onClick={this.onChallengeClicked.bind(this)}>Rechallenge!</button></div>;
        }
        else challengeButton = <div>Being challenged!</div>
        
                
    return (
        <div className="ChampionItem">
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
