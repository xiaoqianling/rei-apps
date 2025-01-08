import React from "react";
import { FunctionComponent } from "react";
import './index.scss'
import ReiSearch from 'rei-design/search'
import TaskList from "./TaskList";
 
const TodoSidebar: FunctionComponent = () => {
    return <div className="sidebar">
        <div className="titleContainer">
            Menu
        </div>
        <div>
            <ReiSearch/>
        </div>
        {/* Task分栏 */}
        <div>
            <span>TASKS</span>
            <TaskList/>
        </div>
    </div>;
}
 
export default TodoSidebar;