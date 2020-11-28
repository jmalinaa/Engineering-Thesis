import React from "react";
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';

import List from '@material-ui/core/List';

import IconButton from '@material-ui/core/IconButton';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Link } from "react-router-dom";

import PropTypes from 'prop-types';

function Sidebar(props) {

    console.log("Sidebar, props: ", props);

    let mouseEvent = 'onClick';
    if (!props.open)
        mouseEvent = false;  //if sidebar isn't open, the clickAwayListener will be disabled

    //todo moze by tak użyć redirect to zamiast linka, bo ten sidebar brzydko wygląda
    //z drugiej strony prze redirectach historia nie działa prawidłowo
    return (
        <ClickAwayListener mouseEvent={mouseEvent} onClickAway={props.handleDrawerClose}>
            <div>
                <CssBaseline />
                <Drawer
                    variant="persistent"
                    anchor="left"
                    open={props.open}
                >
                    <div>
                        <IconButton onClick={props.handleDrawerClose}>
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
                                <ListItemText primary="Strona główna" />
                            </Link>
                        </ListItem>
                        <ListItem button key={"Stations"}>
                            <Link to={"/stations"}>
                                <ListItemText primary="Stacje" />
                            </Link>
                        </ListItem>

                    </List>
                </Drawer>
            </div>
        </ClickAwayListener>
    );
}

Sidebar.propTypes = {
    handleDrawerClose: PropTypes.func.isRequired
}

export default Sidebar;