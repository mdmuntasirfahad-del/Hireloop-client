import React from 'react';
import { getUserSessionRole } from '../../../lib/core/session';

const RecruiterLayout = async ({ children }) => {

    await getUserSessionRole('recruiter'); 

    return children;
};

export default RecruiterLayout;