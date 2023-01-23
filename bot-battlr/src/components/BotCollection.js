import React from "react";

function BotCollection({filteredBots}) {
  return (
    <div className="ui four column grid">
      <div className="row">
        {filteredBots}
      </div>
    </div>
  );
}

export default BotCollection;