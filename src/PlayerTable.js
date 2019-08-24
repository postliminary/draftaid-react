import React, { PureComponent } from 'react';
const maxHue = 300;

class PlayerTable extends PureComponent {
  rows() {
    let players = this.props.players.slice();
    const maxTier = this.props.players.reduce((max, p) => Math.max(p.tier, max), 1);

    if (this.props.size) {
      players = players.slice(0, this.props.size);
    }

    return players.map((player, i) => {
      return (
        <tr key={player.rank}
            className={'pointer'}
            style={this.trStyle(player.tier, this.props.disableColor, maxTier)}
            title={`Avg ${player.average_rank} StdDev ${player.std_dev}`}
            onClick={() => this.onClick(player)}>
          {this.columns(player)}
        </tr>
      )
    });
  }

  onClick(player) {
    if (this.props.onClick) {
      return this.props.onClick(player);
    }
  }

  trStyle(tier, disable, maxTier) {
    if (disable) {
      return {};
    }

    return { backgroundColor: `hsl(${maxHue - (maxHue / maxTier * tier)}, 100%, 90%)` };
  }

  columns(player) {
    return this.props.fields.map((f, i) => {
      if (f === 'tier') {
        return <td key={f}>Tier {player[f]}</td>
      } else {
        return <td key={f}>{player[f]}</td>
      }
    });
  }

  render() {
    return (
      <table className='table table-condensed table-hover table-striped'>
        <tbody>{this.rows()}</tbody>
      </table>
    );
  }
}

PlayerTable.propTypes = {
  players: React.PropTypes.array.isRequired,
  fields: React.PropTypes.array.isRequired,

  onClick: React.PropTypes.func,
  size: React.PropTypes.number,
  disableColor: React.PropTypes.bool,
};

export default PlayerTable
