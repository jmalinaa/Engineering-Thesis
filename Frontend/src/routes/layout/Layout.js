import React from 'react';

import Sidebar from '../../sidebar/Sidebar';

function Layout(props) {

  return (
    <div>
      <div style={{display: "flex"}}>
        <Sidebar />
        <div style={{maxWidth: '800px'}}>
          {props.children}
        </div>
      </div>

    </div>
  )
}

export default Layout;
