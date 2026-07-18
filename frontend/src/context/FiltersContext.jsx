import PropTypes from "prop-types";
import { useState, createContext, useContext } from "react";


const FiltersContext = createContext()
const useFiltersContext = () => {
    const filtersContext = useContext(FiltersContext);
    if(!filtersContext){
        throw new Error("No filters context")
    }
    return filtersContext;
}


const FiltersProvider = ({children}) => {
    const [filter, setFilter] = useState("");
    const updateFilter = (filter) => {
        setFilter(filter);
    }


    return (
        <FiltersContext.Provider value={{filter, updateFilter}}>
            {children}
        </FiltersContext.Provider>
    )
}
FiltersProvider.propTypes = {
    children: PropTypes.node,
};

// eslint-disable-next-line react-refresh/only-export-components -- hook is tightly coupled to FiltersProvider, kept in one file
export { FiltersContext, useFiltersContext, FiltersProvider }