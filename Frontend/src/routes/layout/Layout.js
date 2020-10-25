import React from 'react';

import Sidebar from '../../sidebar/Sidebar';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Container from '@material-ui/core/Container';

function Layout(props) {

  const [open, setOpen] = React.useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <div >
        <AppBar
          position="fixed"
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Kalibrator
            </Typography>
          </Toolbar>
        </AppBar>
        <Toolbar /> {/* Ten toolbar jest ważny - bez niego górny pasek przykrywa część strony */}
        <Container>
          <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
          <div style={{ maxWidth: '800px' }}>
            {props.children}
          </div>
        </Container>

      </div>

    </div>
  )
}

export default Layout;
