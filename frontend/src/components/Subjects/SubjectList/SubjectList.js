import React from 'react';

import SubjectItem from './SubjectItem/SubjectItem';
import './SubjectList.css';

const subjectList = props => {
  const subjects = props.subjects.map(subject => {
    return (
      <SubjectItem
        key={subject._id}
        eventId={subject._id}
        subject={subject.subject}
        userId={props.authUserId}
        creatorId={subject.creator._id}
        onDetail={props.onViewDetail}
      />
    );
  });

  return <ul className="subject__list">{subjects}</ul>;
};

export default subjectList;