import React, { useRef, useState } from 'react';
import { TextArea } from './TextArea';
import { AddEntityInput } from './AddEntityInput';
import { FoundEntities } from './FoundEntities';

export const EntityHighlighter = () => {
  const [{selectionStart, selectionEnd}, setSelection] = useState({ selectionStart: 0, selectionEnd: 0});
  const [text, setText] = useState('Venture first mover advantage learning curve market ecosystem funding stealth disruptive social proof scrum project growth hacking niche market user experience graphical user interface.');
  const [entities, setEntities] = useState([
    { start: 160, end: 184, label: 'very important'},
    { start: 144, end: 159, label: 'very important'},
    { start: 62, end: 69, label: 'important' },
    { start: 116, end: 130, label: 'nonsense' },
    { start: 8, end: 29, label: 'nonsense' },
  ]);

  const inputNode = useRef(null);

  const findEntities = selectionStart => entities.filter(({start, end}) => start <= selectionStart && end > selectionStart);

  const foundEntities = findEntities(selectionStart);

  const deleteEntity = ({start, end, label}) => {
    const newEntities = entities.filter(e => e.start !== start && e.end !== end && e.label !== label);
    setEntities(newEntities);
  }

  return (
    <>
      <TextArea
        entities={entities}
        inputNode={inputNode}
        text={text}
        setText={setText}
        setEntities={setEntities}
        setSelection={setSelection}
      />
      <AddEntityInput 
        selectionStart={selectionStart}
        selectionEnd={selectionEnd}
        entities={entities}
        setEntities={setEntities}
      />
      <FoundEntities
        foundEntities={foundEntities}
        text={text}
        deleteEntity={deleteEntity}
      />

    </>
  );

}
