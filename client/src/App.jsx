import {Routes, Route, Navigate} from "react-router-dom";
import HomePage from "@/pages/Home.jsx";
import ProfilePage from "@/pages/Profile.jsx";
import Auth from "@/pages/Auth.jsx";
import './index.css'
import { Toaster } from "@/components/ui/sonner"



export default function App() {
    return (
        <Routes>
            <Route path="/auth" element={<Auth/>}/>

            <Route path="/" element={<HomePage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>

            <Route path="*" element={<Navigate to="/"/>}/>
        </Routes>
    );
}
