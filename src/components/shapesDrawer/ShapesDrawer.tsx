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
import { FC, useEffect, useMemo, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Checkbox, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { shapesAPI } from 'services/ShapesService';
import { AppBar, DrawerHeader, drawerWidth, Main } from 'components/shapesDrawer/DrawerStyledComponents';
import { useAppDispatch } from 'hooks/redux';
import { useSearchParams } from 'react-router-dom';
import { Square } from 'components/shapes/Square/Square';
import { Circle } from 'components/shapes/Circle/Circle';
import { Shade } from 'store/reducers/ShapeSlice';
import { isShapeShade } from 'utils/typeGuards/shapeShade';
import { useDrawer } from 'hooks/useDrawer';
import { useShapeFilters } from 'hooks/useShapeFilters';

// TODO Данный код для "верстки" SharpsDrawer и в файле DrawerStyledComponents по большей
// части взят из документации MUI https://mui.com/material-ui/react-drawer/
// для экономии времени

type SerializedQuery = [string, string][];

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

const isCheckedState = (serializedQuery: SerializedQuery, paramName: string, value: string): boolean => {
  const index: number = serializedQuery.findIndex(([queryName]) => queryName === paramName);

  if (index >= 0) {
    return serializedQuery[index][1].split(',').includes(value);
  }
  return false;
};

const getShadeRadioValue = (serializedQuery: SerializedQuery, paramName: string): Shade => {
  const index: number = serializedQuery.findIndex(([queryName]) => queryName === paramName);
  if (index >= 0) {
    const res: string = serializedQuery[index][1];
    if (isShapeShade(res)) return res;
  }
  return 'all';
};

export const ShapesDrawer: FC = () => {
  const theme = useTheme();
  const { handleOpenDrawer, handleCloseDrawer, open } = useDrawer(true);
  const [columns, setColumns] = useState<number>(4);
  const [skip, setSkip] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { filters, setFilters } = useShapeFilters();
  const dispatch = useAppDispatch();

  const { handleSubmit, handleChange, values, errors } = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: values => setColumns(Number(values.columns)),
  });

  const { data: shapes, refetch, isLoading, error } = shapesAPI.useFetchShapesQuery(filters, { skip: skip });

  useEffect(() => {
    dispatch(setFilters(searchParams));
    setSkip(false);
  }, []);

  useEffect(() => {
    if (!skip) refetch();
  }, [skip, searchParams, refetch]);

  const filtersUpdate = (): void => {
    setSearchParams(searchParams);
    dispatch(setFilters(searchParams));
  };

  const { red, green, blue, yellow, circle, square, radioValue } = useMemo(() => {
    const serializedQuery = [...searchParams];

    return {
      red: isCheckedState(serializedQuery, 'color', 'red'),
      green: isCheckedState(serializedQuery, 'color', 'green'),
      blue: isCheckedState(serializedQuery, 'color', 'blue'),
      yellow: isCheckedState(serializedQuery, 'color', 'yellow'),
      circle: isCheckedState(serializedQuery, 'form', 'circle'),
      square: isCheckedState(serializedQuery, 'form', 'square'),
      radioValue: getShadeRadioValue(serializedQuery, 'shade'),
    };
  }, [searchParams]);

  const handleShadeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const radioName = event.target.name;

    if (isShapeShade(radioName)) {
      searchParams.set('shade', radioName);

      filtersUpdate();
    }
  };

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, propertyName: string) => {
    const name = event.target.name;
    const checked = event.target.checked;
    let colors = searchParams.get(propertyName)?.split(',') ?? [];

    if (checked) colors.push(name);
    if (!checked) colors = colors.filter(i => i !== name);

    colors.length ? searchParams.set(propertyName, colors.join(',')) : searchParams.delete(propertyName);

    filtersUpdate();
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleOpenDrawer}
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
          <IconButton onClick={handleCloseDrawer}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <RadioGroup name="shade-radio-group" value={radioValue} onChange={handleShadeChange}>
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
                control={<Checkbox id="red" name="red" checked={red} onChange={e => handleCheck(e, 'color')} />}
                label="Красные"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                name="green"
                control={<Checkbox id="green" name="green" checked={green} onChange={e => handleCheck(e, 'color')} />}
                label="Зеленые"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                name="blue"
                control={<Checkbox id="blue" name="blue" checked={blue} onChange={e => handleCheck(e, 'color')} />}
                label="Синие"
              />
            </ListItem>
            <ListItem>
              <FormControlLabel
                name="yellow"
                control={
                  <Checkbox id="yellow" name="yellow" checked={yellow} onChange={e => handleCheck(e, 'color')} />
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
              control={<Checkbox id="circle" name="circle" checked={circle} onChange={e => handleCheck(e, 'form')} />}
              label="Круги"
            />
          </Box>
          <FormControlLabel
            name="square"
            control={<Checkbox id="square" name="square" checked={square} onChange={e => handleCheck(e, 'form')} />}
            label="Квадраты"
          />
        </Box>
        <Box mb={4}>
          <Divider />
        </Box>
        <Grid container spacing={2} columns={columns}>
          {!isLoading ? (
            shapes && shapes.length > 0 ? (
              shapes.map((shape, index) => (
                <Grid key={index} item xs={1} sx={{ height: 'auto' }}>
                  {shape.form === 'square' && <Square {...shape} />}
                  {shape.form === 'circle' && <Circle {...shape} />}
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
