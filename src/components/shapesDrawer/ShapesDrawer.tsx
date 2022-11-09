import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import SettingsSuggest from '@mui/icons-material/SettingsSuggest';
import { FC, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Checkbox, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { shapesAPI } from '../../services/ShapesService';
import { AppBar, DrawerHeader, drawerWidth, Main } from './DrawerStyledComponents';
import { useSearchParams } from 'react-router-dom';
import { Square } from '../shapes/Square/Square';
import { Circle } from '../shapes/Circle/Circle';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { Filters, shapeSlice } from '../../store/reducers/ShapeSlice';

// TODO Данный код для "верстки" SharpsDrawer и в файле DrawerStyledComponents по большей
// части взят из документации MUI https://mui.com/material-ui/react-drawer/
// для экономии времени

const validationSchema = yup.object({
  columns: yup
    .number()
    .min(2, 'Количество колонок не должно быть меньше 2')
    .max(6, 'Количество колонок не должно привышать 6')
    .required('Количество колонок не должно быть пустым')
    .typeError('Количество колонок должно быть числом'),
});

const initialValues = {
  columns: 4,
};

export const ShapesDrawer: FC = () => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(true);
  const [skip, setSkip] = useState<boolean>(true);
  const [columns, setColumns] = useState<number>(4);
  const [searchParams, setSearchParams]: [URLSearchParams, Function] = useSearchParams();
  const { filters, parsedFilters } = useAppSelector(state => state.userReducer);
  const { setFilters, setParsedFilters } = shapeSlice.actions;
  const dispatch = useAppDispatch();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: values => setColumns(Number(values.columns)),
  });

  const { data: shapes, refetch, isLoading, error } = shapesAPI.useFetchShapesQuery(parsedFilters, { skip: skip });

  useEffect(() => {
    dispatch(setFilters(searchParams));
    dispatch(setParsedFilters(''));
    setSkip(false);
  }, []);

  useEffect(() => {
    if (!skip) refetch();
  }, [skip, searchParams, refetch]);

  const handleDarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioName = event.target.name as Filters['shade'];
    if (radioName) {
      searchParams.set('shade', radioName);

      setSearchParams(searchParams);
      dispatch(setFilters(searchParams));
      dispatch(setParsedFilters(''));
    }
  };

  const handleFormCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const formName = event.target.name;
    const checked = event.target.checked;
    let forms = searchParams.get('form')?.split(',') ?? [];
    if (checked) forms.push(formName);
    if (!checked) forms = forms.filter(i => i !== formName);

    forms.length ? searchParams.set('form', forms.join(',')) : searchParams.delete('form');

    setSearchParams(searchParams);
    dispatch(setFilters(searchParams));
    dispatch(setParsedFilters(''));
  };

  const handleColorCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
    const colorName = event.target.name;
    const checked = event.target.checked;
    let colors = searchParams.get('color')?.split(',') ?? [];

    if (checked) colors.push(colorName);
    if (!checked) colors = colors.filter(i => i !== colorName);

    colors.length ? searchParams.set('color', colors.join(',')) : searchParams.delete('color');

    setSearchParams(searchParams);
    dispatch(setFilters(searchParams));
    dispatch(setParsedFilters(''));
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Круги и квадраты
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <RadioGroup name="dark-radio-group" value={filters?.shade || 'all'} onChange={handleDarkChange}>
            <ListItem>
              <FormControlLabel value="all" control={<Radio name="all" />} label="Все" />
            </ListItem>
            <ListItem>
              <FormControlLabel value="dark" control={<Radio name="dark" />} label="Темные" />
            </ListItem>
            <ListItem>
              <FormControlLabel value="light" control={<Radio name="light" />} label="Светлые" />
            </ListItem>
          </RadioGroup>
        </List>
        <Divider />
        <List>
          <Box display="flex" flexDirection="column">
            <ListItem>
              <FormControlLabel
                name="red"
                control={
                  <Checkbox id="red" name="red" checked={filters.color?.red || false} onChange={handleColorCheck} />
                }
                label="Красные"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                name="green"
                control={
                  <Checkbox
                    id="green"
                    name="green"
                    checked={filters.color?.green || false}
                    onChange={handleColorCheck}
                  />
                }
                label="Зеленые"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                name="blue"
                control={
                  <Checkbox id="blue" name="blue" checked={filters.color?.blue || false} onChange={handleColorCheck} />
                }
                label="Синие"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                name="yellow"
                control={
                  <Checkbox
                    id="yellow"
                    name="yellow"
                    checked={filters.color?.yellow || false}
                    onChange={handleColorCheck}
                  />
                }
                label="Желтые"
              />
            </ListItem>
          </Box>
        </List>
        <Divider />
        <List>
          <ListItem>
            <Box>
              <Box mb={0.5}>
                <Typography variant="subtitle1">Количество колонок</Typography>
              </Box>
              <form onSubmit={handleSubmit}>
                <TextField
                  variant="outlined"
                  size="medium"
                  name="columns"
                  placeholder="Количество колонок"
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <IconButton type="submit">
                        <SettingsSuggest />
                      </IconButton>
                    ),
                  }}
                  value={values.columns}
                  error={Boolean(errors.columns)}
                  helperText={errors.columns}
                  autoComplete="off"
                />
              </form>
            </Box>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box display="flex" justifyContent="center" mb={2}>
          <Box mr={4}>
            <FormControlLabel
              name="circle"
              control={
                <Checkbox
                  id="circle"
                  name="circle"
                  checked={filters.form?.circle || false}
                  onChange={handleFormCheck}
                />
              }
              label="Круги"
            />
          </Box>
          <FormControlLabel
            name="square"
            control={
              <Checkbox id="square" name="square" checked={filters.form?.square || false} onChange={handleFormCheck} />
            }
            label="Квадраты"
          />
        </Box>
        <Box mb={4}>
          <Divider />
        </Box>
        <Grid container spacing={2} columns={columns}>
          {!isLoading ? (
            shapes && shapes?.length > 0 ? (
              shapes.map((i, index) => (
                <Grid key={index} item xs={1} sx={{ height: 'auto' }}>
                  {i.form === 'square' && <Square {...i} />}
                  {i.form === 'circle' && <Circle {...i} />}
                </Grid>
              ))
            ) : (
              <Box display="flex" width="100%" justifyContent="center" p={5}>
                <Typography variant="h4" color="text.secondary">
                  {error ? 'Произошла ошибка' : 'Ничего не найдено по заданным параметрам'}
                </Typography>
              </Box>
            )
          ) : (
            <Box display="flex" justifyContent="center" pt={16} width="100%">
              <CircularProgress />
            </Box>
          )}
        </Grid>
      </Main>
    </Box>
  );
};
