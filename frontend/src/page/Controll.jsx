import DashBoard from "./Controll/DashBoard";
import Middle from "./Controll/middle";


export default function Controll() {
    return (
        <div className="w-full h-screen grid  grid-cols-[15%_85%]">
            <DashBoard className="w-full h-full" />
        
            <Middle className="w-full h-full"/>

        </div>
    )
}