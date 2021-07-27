import React, { useState } from "react";
import { styles } from "./styles";

export const AddEntityInput = ({selectionStart, selectionEnd, entities, setEntities}) => {
  const [inputText, setInputText] = useState('');
  const isDisabled = selectionStart === selectionEnd;
  return (
    <div style={styles.entityInput}>
      <input
        type="text"
        placeholder="Entity label"
        value={inputText}
        onChange={(event) => setInputText(event.target.value)}
        disabled={isDisabled}

      />
      <button
        onClick={() => setEntities(entities.concat({ start: selectionStart, end: selectionEnd, label: inputText }))}
        disabled={isDisabled}
      >
        Add entity for selection
      </button>
  </div>
  )
}