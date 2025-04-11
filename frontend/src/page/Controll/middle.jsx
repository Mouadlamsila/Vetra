import { Route, Routes } from "react-router-dom";
import BoardTable from "./components/BoardTable";

export default function Middle() {
    return (
        <div className="">
            <Routes>
                <Route path="/" element={<BoardTable />} />
                
            </Routes>
        </div>
    )
}
