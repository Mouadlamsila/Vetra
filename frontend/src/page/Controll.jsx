import DashBoard from "./Controll/DashBoard";
import MenuPhone from "./Controll/MenuPhone";
import Middle from "./Controll/middle";


export default function Controll() {
    return (
        <div className="w-full h-screen grid grid-cols-1 sm:grid-cols-[15%_85%]">
            <DashBoard className="w-full h-full" />
            <MenuPhone className="w-full h-full" />
            <Middle className="w-full h-full"/>

        </div>
    )
}