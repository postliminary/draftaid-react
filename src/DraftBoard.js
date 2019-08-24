import React, {Component} from 'react';

import UndraftedAll from './UndraftedAll'
import UndraftedPositions from './UndraftedPositions'
import Drafted from './Drafted'
import debounce from "./debounce";

const localStorageKey = 'draft-aid-state';

class DraftBoard extends Component {
    constructor() {
        super();

        this.state = {
            players: [],
            filteredPlayers: [],
            isLoading: true,
            currentDraft: 0,
            fetchError: null,
            format: 'standard',
            query: '',
            lastUpdated: null,
        };

        this.saveSnapshot = debounce(this.saveSnapshot);
    }

    componentDidMount() {
        const snapshotJson = window.localStorage.getItem(localStorageKey);
        if (snapshotJson) {
            const snapshot = JSON.parse(snapshotJson);
            this.setState({
                ...snapshot,
                isLoading: false,
            });
        } else {
            this.fetchPlayers(this.state.format, 300);
        }
    }

    saveSnapshot() {
        const {
            fetchError,
            isLoading,
            ...rest
        } = this.state;

        window.localStorage.setItem(localStorageKey, JSON.stringify(rest));
    }

    fetchPlayers(format) {
        // const url = 'https://draftaid-api.herokuapp.com/rankings';
        const url = 'https://jayzheng-ff-api.herokuapp.com/rankings';
        const self = this;

        this.setState({ isLoading: true });

        fetch(url + '?format=' + format, {
            method: 'get'
        }).then(function (response) {
            response.json().then(function (res) {
                self.setState({
                    players: res.rankings,
                    filteredPlayers: res.rankings,
                    isLoading: false,
                    format: format,
                    query: '',
                    currentDraft: 0,
                    lastUpdated: new Date(res.updatedAt),
                }, self.saveSnapshot);
            });
        }).catch(function (err) {
            self.setState({
                fetchError: err,
                isLoading: false,
            });
        });
    }

    searchPlayers(query) {
        let players = this.state.players.filter(player =>
            player.name.toUpperCase().includes(query.toUpperCase())
        );

        this.setState({
            filteredPlayers: players,
            query: query,
        });
    }

    draft(player) {
        const players = this.state.players.slice();
        const index = players.findIndex(p => p.rank === player.rank);
        if (~index) {
            players[index].drafted = this.state.currentDraft + 1;
        }

        this.setState({
            currentDraft: this.state.currentDraft + 1,
            players: players,
            filteredPlayers: players,
            query: '',
        }, this.saveSnapshot);
    }

    undo(currentDraft) {
        if (currentDraft === 0) {
            return
        }

        const players = this.state.players.slice();
        const index = players.findIndex(p => p.drafted === currentDraft);
        if (~index) {
            players[index].drafted = null;
        }

        this.setState({
            currentDraft: this.state.currentDraft - 1,
            players: players,
            filteredPlayers: players,
            query: '',
        }, this.saveSnapshot);
    }

    reset() {
        const players = this.state.players.slice();
        players.map((player, i) => {
            return player.drafted = null;
        });

        this.setState({
            currentDraft: 0,
            players: players,
            filteredPlayers: players,
            query: '',
        }, this.saveSnapshot);
    }

    render() {
        if (this.state.isLoading) {
            return (<div className='row'>Loading...</div>)
        }

        if (this.state.fetchError) {
            return (<div className='row'>error fetching rankings...</div>)
        }

        return (
            <div className='row'>
                <UndraftedAll
                    players={this.state.filteredPlayers}
                    draft={(p) => this.draft(p)}
                    fetch={(e) => this.fetchPlayers(e.target.value)}
                    search={(e) => this.searchPlayers(e.target.value)}
                    format={this.state.format}
                    query={this.state.query}
                    lastUpdated={this.state.lastUpdated}
                />

                <UndraftedPositions
                    players={this.state.players}
                    draft={(p) => this.draft(p)}
                />

                <Drafted
                    currentDraft={this.state.currentDraft}
                    players={this.state.players}
                    undo={(c) => this.undo(c)}
                    reset={() => this.fetchPlayers('standard')}
                />
            </div>
        );
    }
}

export default DraftBoard;
