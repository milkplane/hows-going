import PathfinderInfo from "./PathfinderInfo";
import SearchButton from "./SearchButton";
import ToolSelect from "./ToolSelect";

const OptionsPanel = () => {
    return <div>
        <PathfinderInfo/>
        <ToolSelect/>
        <SearchButton/>
    </div>
}

export default OptionsPanel;