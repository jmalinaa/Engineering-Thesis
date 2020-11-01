import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import EnhancedTable from '../util/table'

function Stations({ location, props }) {
    console.log("Stations, props: ", props);

    const useStyles = makeStyles((theme) => ({
        root: {
          flexGrow: 1,
        },
        paper: {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
        },
      }));

      const classes = useStyles();

    return (
        <div className={classes.root}>
            <Grid container spacing={3}>
                <Grid item xs={4}>
                    <EnhancedTable

                    
                    />
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>przyciski</Paper>
                </Grid>
                <Grid item xs={4}>
                    <Paper className={classes.paper}>mapa</Paper>
                </Grid>
            </Grid>
        </div>
        
    );

}

export default Stations;