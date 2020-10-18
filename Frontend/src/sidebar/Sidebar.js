import React from "react";
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Link } from "react-router-dom";

function Sidebar(props) {

    console.log("Sidebar, props: ", props);

    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    function stationsClicked() {
        console.log("Main page, stationsclicked");
    }

    return (
        <div>
            <CssBaseline />
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
                        Persistent drawer
            </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="persistent"
                anchor="left"
                open={open}
            >
                <div>
                    <IconButton onClick={handleDrawerClose}>
                        <ChevronLeftIcon />
                    </IconButton>
                </div>
                <List>
                    {/* <Link to={"/stations"}>
                        <ListItem button key={"Stations"}>
                            <ListItemText primary="Stations" />
                        </ListItem>
                    </Link> */}
                    <ListItem button key={"MainPage"}>
                        <Link to={"/"}>
                            <ListItemText primary="Main Page" />
                        </Link>
                    </ListItem>
                    <ListItem button key={"Stations"}>
                        <Link to={"/stations"}>
                            <ListItemText primary="Stations" />
                        </Link>
                    </ListItem>

                </List>
            </Drawer>
        </div>

    );
}

export default Sidebar;