import {auth, provider, db} from "../firebase-config";
import {signInWithPopup} from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import {MessageCircle} from 'lucide-react';
import Cookies from 'universal-cookie';
import './Auth.css';
const cookies = new Cookies();
export default function Auth(props){
    const {setIsAuth} = props;
    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, provider);
            cookies.set("auth-token", result.user.refreshToken);
            setIsAuth(true);

            //
            const userRef = doc(db, "users", result.user.uid);
            await setDoc(userRef, {
                uid: result.user.uid,
                name: result.user.displayName,
                email: result.user.email,
                photoURL: result.user.photoURL,
                lastSeen: serverTimestamp(),
            }, { merge: true });
        } catch (err){
            console.log(err)
        }
    }
    return(
        <div className="auth-container">
    <div className="auth-card">
        <div className="logo-container">
            <div className="logo-circle">
                <MessageCircle />
            </div>
            <h1 className="auth-title">Welcome to ChatApp</h1>
            <p className="auth-subtitle">Connect and chat with friends instantly</p>
        </div>

        <div className="features-container">
            <p className="features-title">Sign in with Google to access:</p>
        </div>

        <button className="google-button" onClick={signInWithGoogle}>
            <img src="https://i.pinimg.com/736x/39/21/6d/39216d73519bca962bd4a01f3e8f4a4b.jpg" alt="Google" />
            <span>Continue with Google</span>
        </button>
    </div>
</div>
    )
}