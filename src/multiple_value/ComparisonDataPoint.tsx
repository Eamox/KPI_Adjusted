import React, { PureComponent, useState } from "react";
import styled from 'styled-components'
import PropTypes from 'prop-types'
// @ts-ignore
import {formatType, lighten} from '../common'
import SSF from "ssf";

const ComparisonDataPointGroup = styled.div`
  flex: 1;
  width: 100%;

  margin: 10px 0;
  
  font-size: 20px;
  color: ${props => props.color};
  font-weight: 100;


  a.drillable-link {
    color: #a5a6a1;
    text-decoration: none;
  }
`
const UpArrow = styled.div.attrs({
  pos: (props: any) => props.pos,
})`
  display: inline-block;
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 10px solid ${props =>
    props.pos ? 'red' : 'green'
  };
  color: 10px solid ${props =>
    props.pos ? 'green' : 'red'
  };
  margin-right: 5px;
`

const DownArrow = styled.div.attrs({
  pos: (props: any) => props.pos,
})`
  display: inline-block;  
  width: 0; 
  height: 0; 
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid ${props =>
    props.pos ? 'green' : 'red'
  };
  color: 10px solid ${props =>
    props.pos ? 'green' : 'red'
  };
  margin-right: 5px;

`

const UpText = styled.div.attrs({
  pos: (props: any) => props.pos,
})`
  display: inline-block;
  color: ${props =>
    props.pos ? 'red' : 'green'
  };

`

const DownText = styled.div.attrs({
  pos: (props: any) => props.pos,
})`
  
  color: ${props =>
    props.pos ? 'green' : 'red'
  };

`

const ComparisonPercentageChange = styled.div`
  display: inline-block;
  padding-right: 5px;
  display:flex;
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
const ComparisonProgressBar = styled.div.attrs({
  background: (props: any) => props.background,
})`
  position: relative;
  background-color: ${props => 
    props.background ? lighten(props.background, 60) : lighten("#282828", 80)
  };
  height: 40px;
  text-align: center;
`
const ComparisonProgressBarFilled = styled.div.attrs({
  pct: (props: any) => props.pct,
})`
  background-color: ${props => 
    props.color
  };
  width: ${props => 
    props.pct
  }%;
  height: 40px;
`
const ComparisonDateProgressBar = styled.div.attrs({
  pct: (props: any) => props.pct,
})`
  background-color: black;
  width: ${props => 
    props.pct
  }%;
  height: 10px;
`



const ComparisonProgressBarLabel = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;  
  color: #000000;

  a.drillable-link {
    color: #000000;
  }
`;

export const ComparisonDataPoint: React.FC<{
  config: any,
  compDataPoint: any,
  dataPoint: any,
  percChange: number,
  progressPerc: number,
  handleClick: (i: any, j: any)=>{},
}> = ({ config, compDataPoint, dataPoint, percChange, progressPerc, handleClick }) => {

  function tryFormatting(formatString: string, value: number, defaultString: string) {
    try {
      return SSF.format(formatString, value)
    }
    catch(err) {
      return defaultString
    }
  }
  compDataPoint.label =  config[`comparison_label_${compDataPoint.name}`]
  const pos = config[`pos_is_bad_${compDataPoint.name}`]
  return (
    <ComparisonDataPointGroup color = {config['subtext_color']}>

    {config[`comparison_style_${compDataPoint.name}`] !== 'percentage_change' ? null : (
      <ComparisonPercentageChange data-value={percChange} onClick={() => { handleClick(compDataPoint, event) }}>
      <span> {config[`title_overrride_${dataPoint.name}`] || dataPoint.label} has gone &nbsp;  </span> 
    {
    percChange >= 0 ? [<UpArrow pos={pos} />, <UpText pos={pos}>{percChange}% </UpText>]: [<DownArrow pos={pos}/>,<DownText pos={pos}>{percChange}%</DownText>]}
    <span>&nbsp;{compDataPoint.label}</span>
      </ComparisonPercentageChange>
    )}

    {config[`comparison_style_${compDataPoint.name}`] !== 'value' ? null : 
    <ComparisonSimpleValue onClick={() => { handleClick(compDataPoint, event) }}>
    {config[`comp_value_format_${compDataPoint.name}`] === "" ? compDataPoint.formattedValue : tryFormatting(config[`comp_value_format_${compDataPoint.name}`], compDataPoint.value, compDataPoint.formattedValue)}
    </ComparisonSimpleValue>}

    {config[`comparison_style_${compDataPoint.name}`] !== 'calculate_progress' &&
    config[`comparison_style_${compDataPoint.name}`] !== 'calculate_progress_perc' ? null : (
      <ComparisonProgressBar background={config[`style_${dataPoint.name}`]}>
        <ComparisonProgressBarFilled
          pct={()=>Math.min(progressPerc || 0, 100)}
          color={percChange > 0? 'green' : 'red'}
        />
        <ComparisonDateProgressBar pct = {() => {
            var now = new Date();
            var days_in = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
            return (now.getDate() / days_in)*100
        }}/>
          {config[`comparison_show_label_${compDataPoint.name}`] === false ? null : (
            <ComparisonProgressBarLabel><div onClick={() => { handleClick(compDataPoint, event) }}>
              {config[`comparison_style_${compDataPoint.name}`] === 'calculate_progress' ? null :
                <>
                  `${progressPerc} % of ${config[`comp_value_format_${compDataPoint.name}`] === "" ? compDataPoint.formattedValue : tryFormatting(config[`comp_value_format_${compDataPoint.name}`], compDataPoint.value, compDataPoint.formattedValue)}`
                </>
              }
              {config[`comparison_label_${compDataPoint.name}`] || compDataPoint.label}
            </div></ComparisonProgressBarLabel>
          )}
      </ComparisonProgressBar>
    )}

    </ComparisonDataPointGroup>
  )
}
