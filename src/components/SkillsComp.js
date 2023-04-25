import React, { Component } from "react";
import {
  Typeahead,
  Highlighter,
  Menu,
  MenuItem,
} from 'react-bootstrap-typeahead';
import List from 'react-tiny-virtual-list';

import "react-bootstrap-typeahead/css/Typeahead.css";

export function SkillsComp({skills, changedElement}) {

  const renderMenu = React.useCallback((results, menuProps, props) => {
    const itemHeight = 32;

    return (
      <Menu {...menuProps}>
        <List
          scrollToIndex={props.activeIndex || 0}
          scrollToAlignment="auto"
          height={results.length < 5 ? results.length * itemHeight : 300}
          itemCount={results.length}
          itemSize={itemHeight}
          renderItem={({ index, style }) => {
            const item = results[index];
            return (
              <MenuItem key={item} option={item} position={index} style={style}>
                <Highlighter search={props.text}>{item}</Highlighter>
              </MenuItem>
            );
          }}
        />
      </Menu>
    );
  });

  return (
    <div style={{ width: '100%', margin: '1rem 1rem' }}>
      <Typeahead
        multiple
        options={skills}
        placeholder="Choose a skill..."
        onChange={changedElement}
        renderMenu={renderMenu}
      />
    </div>
  );
}

export default SkillsComp;
