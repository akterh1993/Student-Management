import React from 'react';

import './AssignControl.css';

const assignControl = props => {
  return (
    <div className="assign-control">
      <button
        className={props.activeOutputType === 'list' ? 'active' : ''}
        onClick={props.onChange.bind(this, 'list')}
      >
        List
      </button>
      <button
        className={props.activeOutputType === 'chart' ? 'active' : ''}
        onClick={props.onChange.bind(this, 'chart')}
      >
        Chart
      </button>
    </div>
  );
};

export default assignControl;
