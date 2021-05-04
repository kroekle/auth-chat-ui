/* eslint-disable import/no-anonymous-default-export */
import React, {useEffect, useState} from 'react';
import './Decisions.css';
import {GridList, GridListTile} from '@material-ui/core';
import {getDecisions} from './shared/services/rest.services';


export default () => {
  
  const ref = React.createRef<HTMLSpanElement>();
  const [decisions, setDecisions] = useState<any[]>([]);
  
  const updateDecisions = () => {
  
    getDecisions()
      .then(resp => setDecisions(resp))
      .catch((err:Error) => {alert(err.message); setDecisions([]);});
  }

  useEffect(() => {

      updateDecisions();
      const timer = setInterval(() => updateDecisions(), 5000);
      return () => clearInterval(timer);

  }, [])

  useEffect(() => {
    if (decisions) {
      if (ref && ref.current) {
        ref.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [decisions, ref])

  return (
    <div className="decision-body">
      <GridList cols={1} cellHeight={25} className="Name-content">
        {
          decisions && decisions.length > 0 && decisions.map((d, i) => (
            <GridListTile key={i} cols={1} className="Name-text">
              <span>{JSON.stringify(d)}</span>
            </GridListTile>
          ))
        }
        <GridListTile key={-1} cols={1} className="Name-text">
          <span className="Name-text" ref={ref}></span>
        </GridListTile>
      </GridList>
    </div>
  );
}

