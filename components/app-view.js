const React = require('react');
const cn = require('classnames');

const PlayerView = require('./player-view');
const LoadingView = require('./loading-view');
const ErrorView = require('./error-view');

module.exports = React.createClass({
  render: function() {
    return (
        <div className='app'>
          {/* Show Error View, ELSE Show Loading View ELSE no view */}


          <div className={cn('player-wrap')}>
            <PlayerView {...this.props} />
          </div>
        </div>
    );
  }
});
