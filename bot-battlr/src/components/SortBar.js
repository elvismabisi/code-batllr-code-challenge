import React, {useRef} from 'react'

function SortBar({handleSortAction, handleFilterAction}){
    const moreInfo = useRef({showMoreInfo: true, moreInfo: <p style={{fontSize: "0.7rem", textAlign: "left", paddingLeft: "0.2rem", color: "red"}}>
        Currently showing all bots. Click on an item to specify the bots you want to see</p>})

    const parentDivStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent:"left",
        alignItems: "start",
        width: "100vw",
        minHeight: "10rem",
        backgroundColor: "rgba(0, 0, 0, 0.10)",
        marginBottom: "2rem",
        paddingBottom: "2rem"
    }

    const sortOptionStyle = {
        paddingLeft: "2rem",
        paddingRight: "1rem",
        paddingBottom: "0",
        marginBottom: '0',
        fontSize: "1.7rem",
        fontWeight: "900",
        color: "rgba(0, 0, 0, 0.6)"
    }


    function unstyleSiblings(element){
        const siblings = Array.from(element.parentElement.parentElement.children)
        for(const sibling of siblings){
            sibling.querySelector('h2').style.color = "rgba(0, 0, 0, 0.6)"
        }
    }


    function currentlyFilteringByNone(currentlyFilteringBy){
        console.log("currently filtering by: ", currentlyFilteringBy)
        for(const key in currentlyFilteringBy){
            if(currentlyFilteringBy[key]){
                return false
            }
        }
        
        return true
    }


    function handleClick(event, action, strategy){
        if(action === 'sort'){
            unstyleSiblings(event.target)
            handleSortAction(strategy)
            event.target.style.color = "#8db600"
        }else if (action === 'filter'){
            const currentlyFilteringBy = handleFilterAction(strategy)
            currentlyFilteringByNone(currentlyFilteringBy) ? moreInfo.current.showMoreInfo = true : moreInfo.current.showMoreInfo = false

            if(!currentlyFilteringBy[strategy]){
                event.target.style.color = "rgba(0, 0, 0, 0.6)"
            }else{
                event.target.style.color = "#8db600"
            }
        }
    }


    function createOptionList(options, action){
        return options.map(option => (
                <div key={option} onClick={(event) => handleClick(event, action, option.toLowerCase())} style={{cursor: "pointer"}}>
                    <h2 style={sortOptionStyle}>{option}</h2>
                </div>            
            )
        )
    }


    return (
        <div style={parentDivStyle}>
            <div style={{marginLeft: "2rem", paddingTop: "1.5rem"}}>
                <h1 style={{fontSize: "1.3rem"}}>Sort By: </h1>
                <fieldset>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {createOptionList(["Health", "Damage", "Armor"], "sort")}
                    </div>
                </fieldset>
                <p style={{fontSize: "0.7rem", textAlign: "left", paddingLeft: "0.2rem"}}>Clicking will toggle between sorting in ascending or descending order</p>
            </div>

            <div style={{marginLeft: "2rem", paddingTop: "1.5rem"}}>
                <h1 style={{fontSize: "1.3rem"}}>Filter By: </h1>
                <fieldset>
                    <div style={{display: "flex", alignItems: "center"}}>
                        {createOptionList(["Support", "Medic", "Assault", "Defender", "Captain", "Witch"], "filter")}
                    </div>                    
                </fieldset>
                <p style={{fontSize: "0.7rem", textAlign: "left", paddingLeft: "0.2rem"}}>Clicking will toggle between adding the bots in that class to the filtered list or not. All non-enlisted bots whose class are selected (in green) are shown in the list below</p>
                {moreInfo.current.showMoreInfo ? moreInfo.current.moreInfo : <></>}
            </div>
        </div>
    )
    
}

export default SortBar