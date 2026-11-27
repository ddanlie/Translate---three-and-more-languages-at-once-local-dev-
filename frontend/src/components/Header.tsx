import { useState } from "react";
import Tabs from "./Tabs";
import logo from '../assets/logo.png'
import { useNavigate } from "react-router";

export default function Header() {
    const [selectedTab, setSelectedTab] = useState<string>('Home');
    
    const routes = [
        {name: 'Home', route: "/"},
        {name: 'Cards', route: "/cards"},
        {name: 'History', route: "/history"},
        {name: 'About', route: "/about"},
    ]

    const navigate = useNavigate();

    const onTabChange = (tab: string) => {
        setSelectedTab(tab);
        navigate(routes.find(route => route.name === tab)?.route ?? "/")
    }

    return (
        <div className="w-full h-18 bg-linen border-b-gray-200 border-b flex flex-row items-center px-20 overflow-hidden">
            <img src={logo} className="w-25"></img>
            <h1 className="text-subhead text-ink font-bold mr-20">Thranslate</h1>
            <div className="flex-1 mr-10">
                <Tabs
                selectedTab={selectedTab}
                tabs={routes.map((route) => route.name)}
                onSelect={onTabChange}
                ></Tabs>
            </div>
            <div className="size-9 min-w-9 rounded-full bg-iris/15 cursor-pointer flex items-center justify-center">
                <p className="text-caption text-iris font-bold">DD</p>
            </div>
        </div>
    )
}
