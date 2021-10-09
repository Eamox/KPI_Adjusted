import React, { PureComponent, useState } from "react";
import styled from 'styled-components';
import PropTypes from 'prop-types';
// @ts-ignore
import {formatType, lighten} from '../common';
import SSF from "ssf";

const ComparisonDataPointGroup = styled.div`
  flex: 1;
  width: 100%;

  margin: 10px 0;
  
  font-size: 16px;
  color: ${props => props.color};
  font-weight: 100;


  a.drillable-link {
    color: #a5a6a1;
    text-decoration: none;
  }
`

const MyMark = styled.mark `
color:${props => props.color}
background: inherit`

const ComparisonPercentageChange = styled.div`
  display: inline-block;
  padding-right: 5px;

  align-items:center;
  :hover {
    text-decoration: underline;
  }
`
const ComparisonSimpleValue = styled.div`
  font-weight: 100;
  display: inline-block;
  padding-right: 5px;
  :hover {
    text-decoration: underline;
  }
`

function tryFormatting(formatString: string, value: number, defaultString: string) {
	try {
	    return SSF.format(formatString, value);
	}
	catch(err) {
	    return defaultString;
	}
    }

export const ComparisonDataPoint: React.FC<{
    config: any,
    change:number,
    percChange: number,
    up:boolean,
    index:number,
    handleClick: (i: any, j: any)=>{},
}> = ({ config, change, percChange,up,index, handleClick }) => {
   
    const pos = config[`pos_is_bad`];
    return (
	<ComparisonDataPointGroup color = {config['subtext_color']}>
	  <ComparisonPercentageChange data-value={percChange}>
	    {/* {config[`title_overrride_${dataPoint.name}`] || dataPoint.label} */}
	    <MyMark color={Number(up) - Number(pos)  != 0 ? 'green' : 'red'}>{
	      [( Math.abs(percChange) < 0.5) ? "■" : (Number(up) - Number(pos)  != 0 ? "▲": "▼")]}</MyMark>
	    <ComparisonSimpleValue>
	      {Math.abs(percChange)}% ({tryFormatting(config[`value_format`]==""?'#,#':config.value_format,change,change.toLocaleString())}) vs. {index == 0? 'Prev. Month' : 'STPY'}
	      </ComparisonSimpleValue>
	  </ComparisonPercentageChange>
	</ComparisonDataPointGroup>
    );
}
