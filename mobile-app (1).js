// App.js - Punto de entrada de la aplicación móvil
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as StoreProvider } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Importar pantallas
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import RequestScreen from './screens/RequestScreen';
import ProfileScreen from './screens/ProfileScreen';
import ApprovalScreen from './screens/ApprovalScreen';
import AdminScreen from './screens/AdminScreen';

// Importar store
import store from './store';

// Importar tema
import theme from './theme';

// Crear navegadores
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegador principal para usuarios autenticados
const MainTabNavigator = () => {
  const { userRole } = store.getState().auth;
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Calendar') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Request') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Approval') {
            iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
          } else if (route.name === 'Admin') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: theme.colors.primary,
        inactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Inicio' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ title: 'Calendario' }} />
      <Tab.Screen name="Request" component={RequestScreen} options={{ title: 'Solicitar' }} />
      
      {/* Pantallas condicionales según el rol */}
      {(userRole === 'manager' || userRole === 'rrhh' || userRole === 'admin') && (
        <Tab.Screen name="Approval" component={ApprovalScreen} options={{ title: 'Aprobar' }} />
      )}
      
      {(userRole === 'rrhh' || userRole === 'admin') && (
        <Tab.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin' }} />
      )}
      
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <StoreProvider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </StoreProvider>
  );
};

export default App;


// screens/LoginScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text, Snackbar, Surface } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/actions/authActions';
import Logo from '../assets/logo.png';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleLogin = () => {
    if (!email || !password) {
      setVisible(true);
      return;
    }
    
    dispatch(loginUser(email, password))
      .then(() => {
        navigation.replace('Main');
      })
      .catch((err) => {
        console.log(err);
        setVisible(true);
      });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Surface style={styles.card}>
          <Image source={Logo} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Gestión de Vacaciones</Text>
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            style={styles.input}
            secureTextEntry
          />
          
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
            loading={loading}
            disabled={loading}
          >
            Iniciar Sesión
          </Button>
          
          <Button mode="text" onPress={() => {}} style={styles.forgotButton}>
            ¿Olvidaste tu contraseña?
          </Button>
        </Surface>
      </ScrollView>
      
      <Snackbar
        visible={visible || !!error}
        onDismiss={() => setVisible(false)}
        duration={3000}
      >
        {error || 'Por favor complete todos los campos'}
      </Snackbar>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
    elevation: 4,
    borderRadius: 10,
  },
  logo: {
    height: 100,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 10,
    paddingVertical: 6,
  },
  forgotButton: {
    marginTop: 20,
  },
});

export default LoginScreen;


// screens/RequestScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Surface,
  Text,
  TextInput,
  Button,
  RadioButton,
  Divider,
  Snackbar,
  Portal,
  Dialog,
  Paragraph,
} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useDispatch, useSelector } from 'react-redux';
import { createVacationRequest } from '../store/actions/vacationActions';
import { formatDate, calculateWorkingDays } from '../utils/dateUtils';

const RequestScreen = () => {
  const [type, setType] = useState('vacaciones');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [comments, setComments] = useState('');
  const [workingDays, setWorkingDays] = useState(0);
  const [snackVisible, setSnackVisible] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');

  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.vacation);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // Calcular días laborables cada vez que cambian las fechas
    const calculateDays = async () => {
      try {
        const days = await calculateWorkingDays(startDate, endDate);
        setWorkingDays(days);
      } catch (error) {
        console.error('Error calculating working days:', error);
      }
    };

    calculateDays();
  }, [startDate, endDate]);

  const onStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      
      // Asegurarse de que la fecha de fin no sea anterior a la de inicio
      if (selectedDate > endDate) {
        setEndDate(selectedDate);
      }
    }
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      if (selectedDate < startDate) {
        setSnackMessage('La fecha de fin no puede ser anterior a la de inicio');
        setSnackVisible(true);
        return;
      }
      setEndDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    // Verificar que las fechas sean válidas
    if (startDate > endDate) {
      setSnackMessage('La fecha de fin no puede ser anterior a la de inicio');
      setSnackVisible(true);
      return;
    }

    // Verificar días laborables
    if (workingDays <= 0) {
      setSnackMessage('Debe solicitar al menos un día laborable');
      setSnackVisible(true);
      return;
    }

    // Mostrar diálogo de confirmación
    setDialogVisible(true);
  };

  const confirmSubmit = () => {
    setDialogVisible(false);
    
    const requestData = {
      tipo: type,
      fecha_inicio: startDate,
      fecha_fin: endDate,
      comentario: comments,
      dias_laborables: workingDays,
    };

    dispatch(createVacationRequest(requestData))
      .then(() => {
        setSnackMessage('Solicitud enviada correctamente');
        setSnackVisible(true);
        // Resetear formulario
        setComments('');
        setType('vacaciones');
        setStartDate(new Date());
        setEndDate(new Date());
      })
      .catch((err) => {
        setSnackMessage(err.message || 'Error al enviar la solicitud');
        setSnackVisible(true);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.card}>
        <Text style={styles.title}>Nueva Solicitud</Text>
        <Divider style={styles.divider} />

        <Text style={styles.sectionTitle}>Tipo de Ausencia</Text>
        <RadioButton.Group onValueChange={value => setType(value)} value={type}>
          <View style={styles.radioRow}>
            <RadioButton.Item label="Vacaciones" value="vacaciones" />
            <RadioButton.Item label="Enfermedad" value="enfermedad" />
          </View>
          <View style={styles.radioRow}>
            <RadioButton.Item label="Permiso" value="permiso" />
            <RadioButton.Item label="Otros" value="otros" />
          </View>
        </RadioButton.Group>

        <Text style={styles.sectionTitle}>Período</Text>
        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.dateLabel}>Fecha Inicio</Text>
            <Button 
              mode="outlined" 
              onPress={() => setShowStartPicker(true)}
              style={styles.dateButton}
            >
              {formatDate(startDate)}
            </Button>
          </View>
          <View style={styles.dateField}>
            <Text style={styles.dateLabel}>Fecha Fin</Text>
            <Button 
              mode="outlined" 
              onPress={() => setShowEndPicker(true)}
              style={styles.dateButton}
            >
              {formatDate(endDate)}
            </Button>
          </View>
        </View>

        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={onStartDateChange}
            minimumDate={new Date()}
          />
        )}

        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={onEndDateChange}
            minimumDate={startDate}
          />
        )}

        <View style={styles.infoBox}>
          <Text>Días laborables: {workingDays}</Text>
          {type === 'vacaciones' && userInfo.diasDisponibles && (
            <Text>Días disponibles: {userInfo.diasDisponibles}</Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>Comentarios</Text>
        <TextInput
          mode="outlined"
          multiline
          numberOfLines={4}
          placeholder="Añade alguna observación o detalles adicionales"
          value={comments}
          onChangeText={setComments}
        />

        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          loading={loading}
          disabled={loading}
        >
          Enviar Solicitud
        </Button>
      </Surface>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Confirmar Solicitud</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              ¿Deseas enviar una solicitud de {type} por {workingDays} días laborables?
            </Paragraph>
            <Paragraph>
              Período: {formatDate(startDate)} - {formatDate(endDate)}
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancelar</Button>
            <Button onPress={confirmSubmit}>Confirmar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <Snackbar
        visible={snackVisible || !!error}
        onDismiss={() => setSnackVisible(false)}
        duration={3000}
        action={{
          label: 'OK',
          onPress: () => setSnackVisible(false),
        }}
      >
        {error || snackMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    padding: 16,
    elevation: 4,
    borderRadius: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dateField: {
    width: '48%',
  },
  dateLabel: {
    marginBottom: 8,
  },
  dateButton: {
    justifyContent: 'center',
  },
  infoBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  submitButton: {
    marginTop: 24,
    paddingVertical: 6,
  },
});

export default RequestScreen;