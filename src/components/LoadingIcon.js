import React from 'react';
import loadingIcon from '../imgs/birdwait.gif';

const LoadingIcon = () => {
    return (
        <div className="loading-icon">
            <img src={loadingIcon} alt="Loading" />
        </div>
    );
};

export default LoadingIcon;