import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import Grid from '@material-ui/core/Grid';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import SettingsModal from './SettingsModal';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const AntSwitch = withStyles((theme) => ({
  root: {
    width: 34,
    height: 18,
    padding: 1,
    display: 'flex',
  },
  switchBase: {
    padding: 3,
    color: theme.palette.grey[500],
    '&$checked': {
      transform: 'translateX(16px)',
      color: theme.palette.common.white,
      '& + $track': {
        opacity: 1,
        backgroundColor: theme.palette.secondary,
        borderColor: theme.palette.text.disabled,
      },
    },
  },
  thumb: {
    width: 12,
    height: 12,
    boxShadow: 'none',
  },
  track: {
    border: `1px solid ${theme.palette.grey[500]}`,
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor: theme.palette.common.white,
  },
  checked: {},
}))(Switch);

export default function Navbar(props) {
  const [checked, setChecked] = useState(localStorage.getItem("unit") === null ? false : localStorage.getItem("unit") === "fahrenheit" ? false : true);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [modalEdited, setModalEdited] = useState(false);
  const theme = useTheme();
  

  const handleOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
      if(modalEdited){
        props.updateCallback();
      }
      setModalEdited(false);
  };

  function modalValueChanged(){
    setModalEdited(true);
  }

  const handleChange = (event) => {
    setChecked(event.target.checked);
    event.target.checked ? localStorage.setItem("unit", "celcius") : localStorage.setItem("unit", "fahrenheit");
    props.updateCallback();
  };

  return (
    <div className={classes.root}>
      <AppBar style={{ marginBottom: "40px" }} position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Temperature
                   </Typography>
          <FormGroup>
            <Typography component="div">
              <Grid component="label" container alignItems="center" spacing={1}>
                <Grid item>F</Grid>
                <Grid item>
                  <AntSwitch checked={checked} onChange={handleChange} name="checkedC" />
                </Grid>
                <Grid item>C</Grid>
              </Grid>
            </Typography>
          </FormGroup>

          <IconButton onClick={handleOpen} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth="sm"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{ style: { backgroundColor:  theme.palette.background.default} }}
      >
        <DialogTitle id="alert-dialog-title">{"Settings"}</DialogTitle>
        <DialogContent>
          <SettingsModal changed={modalValueChanged}/>
        </DialogContent>
      </Dialog>

    </div>
  );
}