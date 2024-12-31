import { FunctionComponent, ReactNode } from "react";

interface ReiSearchProps {
    icon?: ReactNode;
    placeholder?: string;
    onChange?: (value: string) => void;
    onSearch?: (value: string) => void;
    /** 是否支持点击x 一键清除内容 */
    clearable?: boolean;
}
 
const ReiSearch: FunctionComponent<ReiSearchProps> = ({icon, placeholder, onChange, onSearch, clearable}) => {
    return <div>
        这是一个搜索栏组件
        {/* icon  */}
    </div>;
}
 
export default ReiSearch;