import React from 'react';

import './SubjectItem.css';

const subjectItem = props => (
  <li key={props.subjectId} className="subjects__list-item">
    <div>
      <h1>{props.subject}</h1>
    </div>
    <div>
      {props.studentId === props.creatorId ? (
        <p>Your the owner of this subject.</p>
      ) : (
        <button className="btn" onClick={props.onDetail.bind(this, props.subjectId)}>
          View Details
        </button>
      )}
    </div>
  </li>
);

export default subjectItem;
