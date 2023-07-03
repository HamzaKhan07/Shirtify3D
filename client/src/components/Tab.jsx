/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import { useSnapshot } from 'valtio';

import state from '../state';

const Tab = (props) => {
  const snap = useSnapshot(state);

  const activeStyles = props.isFilterTab && props.isActiveTab 
  ? {backgroundColor: snap.color, opacity: 0.5} 
  : {backgroundColor: 'transparent', opacity: 1}

  return (
    <div
      key={props.tab.name}
      className={`tab-btn ${props.isFilterTab ? 'rounded-full gramorphism' : 'rounded-4'}`}
      onClick={props.handleClick}
      style={activeStyles}
    >
      <img src={props.tab.icon} 
      alt={props.tab.name}
        className={`${props.isFilterTab ? 'w-2/3 h-2/3': 
        'w-11/12 h-11/12 object-contain'}`}
      />
    </div>
  )
}

export default Tab