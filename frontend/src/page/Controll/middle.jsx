import { Route, Routes } from "react-router-dom";
import BoardTable from "./components/BoardTable";
import Profile from "./components/Profile";

export default function Middle() {
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<BoardTable />} />
                <Route path="/Profil" element={<Profile />} />
            </Routes>
        </div>
    )
}
