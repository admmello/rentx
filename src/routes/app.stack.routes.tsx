import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { CarDetails } from '../screens/CarDetails'
import { Home } from '../screens/Home'
import { Scheduling } from '../screens/Scheduling'
import { Confirmation } from '../screens/Confirmation'
import { SchedulingDetails } from '../screens/SchedulingDetails'
import { MyCars } from '../screens/MyCars'
import { Splash } from '../screens/Splash'
import { SignIn } from '../screens/SignIn'
import { SignUpFirstStep } from '../screens/SignUp/SignUpFirstStep'
import { SignUpSecondStep } from '../screens/SignUp/SignUpSecondStep'

const { Navigator, Screen } = createNativeStackNavigator()

export function AppStackRoutes() {
    return (
        <Navigator
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName='Home'
        >
            <Screen
                name='Home'
                component={Home}
                options={{
                    gestureEnabled: false
                }}
            />
            <Screen
                name='CarDetails'
                component={CarDetails}
            />
            <Screen
                name='Scheduling'
                component={Scheduling}
            />
            <Screen
                name='Confirmation'
                component={Confirmation}
            />
            <Screen
                name='SchedulingDetails'
                component={SchedulingDetails}
            />
            <Screen
                name='MyCars'
                component={MyCars}
            />
        </Navigator>
    )
}