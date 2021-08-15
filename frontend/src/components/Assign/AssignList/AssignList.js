import React from 'react';

import './AssignList.css';

const assignList = props => (
  <ul className="assign__list">
    {props.assign.map(assign => {
      return (
        <li key={assign._id} className="assign__item">
          <div className="assign__item-data">
            {assign.subject.subject} -{' '}
            {new Date(assign.createdAt).toLocaleDateString()}
          </div>
          <div className="assign__item-actions">
            <button className="btn" onClick={props.onDelete.bind(this, assign._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default assignList;
