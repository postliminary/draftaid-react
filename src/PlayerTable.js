import React, { PureComponent } from 'react';

class PlayerTable extends PureComponent {
  rows() {
    let players = this.props.players.slice();

    if (this.props.size) {
      players = players.slice(0, this.props.size);
    }

    return players.map((player, i) => {
      return (
        <tr key={player.rank}
            className={this.trClassName(player.tier, this.props.disableColor)}
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

  trClassName(tier, disable) {
    if (disable) {
      return 'pointer'
    }
    if (tier % 4 === 0) {
      return 'active pointer'
    }
    if (tier % 4 === 1) {
      return 'success pointer'
    }
    if (tier % 4 === 2) {
      return 'warning pointer'
    }
    if (tier % 4 === 3) {
      return 'info pointer'
    }
    return 'danger pointer'
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
