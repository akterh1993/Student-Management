import React from 'react';

export default React.createContext({
    token: null,
    studentId: null,
    login: (token, studentId, tokenExpiration) => {},
    logout: () => {}
});