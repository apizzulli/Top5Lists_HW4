import { useContext } from 'react'
import HomeScreen from './HomeScreen'
import SplashScreen from './SplashScreen'
import AuthContext from '../auth'
import ErrorModal from './ErrorModal'
export default function HomeWrapper() {
    const { auth } = useContext(AuthContext);
    console.log("HomeWrapper auth.loggedIn: " + auth.loggedIn);
    
    if (auth.loggedIn)
        return <HomeScreen>
                <ErrorModal/>
                </HomeScreen>

    else
        return <SplashScreen>
            <ErrorModal/>
            </SplashScreen>
}