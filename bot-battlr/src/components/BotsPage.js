import React, {useEffect, useRef, useState} from "react";
import YourBotArmy from "./YourBotArmy";
import BotCollection from "./BotCollection";
import BotCard from "./BotCard"
import BotSpecs from "./BotSpecs";
import SortBar from "./SortBar";

function BotsPage() {
  //start here with your code for step one
  const [allBots, setAllBots] = useState([])
  const [filteredBots, setFilteredBots] = useState([])
  const [enlistedBots, setEnlistedBots] = useState([])
  const [botSpecs, setBotSpecs] = useState(null)
  const [showSortBar, setShowSortBar] = useState(true)
  const sortStrategy = useRef({ health: 1, damage: 1, armor: 1 })
  const currentlyFilteringBy = useRef({support: false, medic: false, assault: false, defender: false, captain: false, witch: false})


  useEffect(()=>{
    fetch("http://localhost:3000/bots")
    .then(result => result.json())
    .then(data => {
      setAllBots(data)
      setFilteredBots(data)
    })
  }, [])


  function getEnlistedBotOfSameClass(bot){
    return enlistedBots.find(enlistedBot => enlistedBot.bot_class === bot.bot_class)
  }


  function botAlreadyEnlisted(bot){
    return Boolean(enlistedBots.find(enlistedBot => enlistedBot.id === bot.id))
  }


  function removeBotFromDatabase(botToDelete){
    fetch(`http://localhost:3000/bots/${botToDelete.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(result => result.json())
    .then(() => {
      setAllBots(allBots.filter(currentBot => currentBot.id !== botToDelete.id))
      setEnlistedBots(enlistedBots.filter(enlistedBot => enlistedBot.id !== botToDelete.id))
    })
  }


  function handleBotAction(bot, action){
    switch(action){
      case "release-bot":
        removeBotFromDatabase(bot)   
        break;
        default:
            console.error(`Unexpected action: ${action}`)
        break

      case "enlist-bot":
        const enlistedBotOfSameClass = getEnlistedBotOfSameClass(bot)
        if(!enlistedBotOfSameClass){
          setEnlistedBots([...enlistedBots, bot])
          setFilteredBots(filteredBots.filter(currentBot => currentBot.id !== bot.id))
        }else{
          alert(`Uh-Oh!\nThe ${bot.bot_class} role has already been filled\n${enlistedBotOfSameClass.name} is currently doing that`)
        }
        break;

      case "delist-bot":
        setEnlistedBots(enlistedBots.filter(currentBot => currentBot.id !== bot.id))
        setFilteredBots([...filteredBots, bot])
        break;
        
      case "show-all-bots":
        setBotSpecs(null)
        setShowSortBar(true)
        break;
        
      case "show-bot-specs":
        setBotSpecs(bot)
        setShowSortBar(false)
    }
  }


  function getBotList(botsArray){
    return botsArray.map(bot => <BotCard key={bot.id} bot={bot} handleBotAction={handleBotAction}/>)
  }


  function sortBots(data, sortBy){
    data.sort((a, b) => {
      if(a[sortBy] > b[sortBy]){
        return sortStrategy.current[sortBy] * 1
      }else if(a[sortBy] < b[sortBy]){
        return sortStrategy.current[sortBy] * -1
      } else {
        return 0
      }
    })

    return data
  }


  function updateSortStrategy(sortBy){
    sortStrategy.current[sortBy] *= -1 //if it was ascending, make it descending and vice versa
  }

  
  function handleSortAction(sortBy){
    updateSortStrategy(sortBy)
    setFilteredBots(sortBots([...filteredBots], sortBy))
  }


  function capitalizeFirstLetter(string){
    const firstLetterCapitalized = string[0].toUpperCase()
    const restOfLetters = string.split("").slice(1).join("")
    
    return firstLetterCapitalized + restOfLetters
  }


  function handleFilterAction(filterBy){
    if(filteredBots === allBots){
      setFilteredBots(allBots.filter(
        bot => bot.bot_class === capitalizeFirstLetter(filterBy)
      ).filter(filteredBot => !botAlreadyEnlisted(filteredBot)))
      currentlyFilteringBy.current[filterBy] = true

    }else if(currentlyFilteringBy.current[filterBy]){
      const newFilteredBots = filteredBots.filter(bot => bot.bot_class !== capitalizeFirstLetter(filterBy))
      if(!newFilteredBots.length){
        setFilteredBots(allBots)
      }else{
        setFilteredBots(newFilteredBots)
      }
      currentlyFilteringBy.current[filterBy] = false

    }else if(!currentlyFilteringBy.current[filterBy]) {
      const additionalBots = allBots.filter(
        bot => bot.bot_class === capitalizeFirstLetter(filterBy)
      ).filter(filteredBot => !botAlreadyEnlisted(filteredBot))

      setFilteredBots([...filteredBots,...additionalBots])
      currentlyFilteringBy.current[filterBy] = true
    }

    return currentlyFilteringBy.current
  }

  return (
    <div>
      <YourBotArmy enlistedBots={getBotList(enlistedBots)}/>
      {showSortBar ? <SortBar handleSortAction={handleSortAction} handleFilterAction={handleFilterAction}/> : <div></div>}
      {botSpecs ? <BotSpecs bot={botSpecs} handleBotAction={handleBotAction} botAlreadyEnlisted={botAlreadyEnlisted(botSpecs)}/> : <BotCollection filteredBots={getBotList(filteredBots)}/>}
    </div>
  )
}

export default BotsPage;