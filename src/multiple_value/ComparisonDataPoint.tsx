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
  width:100%;
  align-items:center;
  :hover {
    text-decoration: underline;
  }
`
const ComparisonSimpleValue = styled.div`
  font-weight: 100;
  display: inline-block;
  padding-right: 5px;
  display: grid;
  grid-template-columns: 1fr .5fr;
  align-items:end;
  justify-content: space-between;
  :hover {
    text-decoration: underline;
  }
`;

const MarkPercentHolder = styled.div`  
  display:flex;
  grid-column:1;`;

const VsSpan = styled.div`  
  grid-column:2;`;

const ActualNum = styled.div`
font-size:13px;

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
    fontSize:any,
    config: any,
    change:number,
    percChange: number,
    up:boolean,
    index:number,
    handleClick: (i: any, j: any)=>{},
}> = ({ fontSize, config, change, percChange,up,index, handleClick }) => {
    const pos = config[`pos_is_bad`];
    var color = Number(up) - Number(pos)  != 0 ? 'green' : 'red';
    color = Math.abs(percChange) < 10 ? "#FBC834" : color;
    const formattedChange = tryFormatting(config.value_format,change,"NA");
    console.log(fontSize);
    return (
	<ComparisonDataPointGroup color = {config['subtext_color']}>
	  <ComparisonPercentageChange data-value={percChange}>
	    {/* {config[`title_overrride_${dataPoint.name}`] || dataPoint.label} */}
	    <ComparisonSimpleValue>
	      <MarkPercentHolder>
		<MyMark color={color}>
		{( Math.abs(percChange) < 10) ? "■" : (Number(up) - Number(pos)  != 0 ? "▲": "▼")}
	      </MyMark>
		<ActualNum>{Math.abs(percChange)}% ({formattedChange})</ActualNum>
	    </MarkPercentHolder>
            <VsSpan> vs. {index == 0? 'PM' : 'STPY'}</VsSpan>
</ComparisonSimpleValue>
	  </ComparisonPercentageChange>
	</ComparisonDataPointGroup>
    );
}
