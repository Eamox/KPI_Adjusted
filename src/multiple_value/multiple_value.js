import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { createGlobalStyle } from 'styled-components';
import {formatType, lighten} from '../common';
import { ComparisonDataPoint } from './ComparisonDataPoint';

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${props => props.backgroundColor}
}`;

const DataPointsWrapper = styled.div`
  font-family: "Open Sans", "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
  display: flex;
  flex-direction: ${props => props.layout === 'horizontal' ? 'row' : 'column'}!important;
  align-items: center;
  margin: 10px;
  height: 100%;
  border-left: 15px solid ${props => props.borderColor};
  border-radius: 14px;
  justify-content: center;
`

const dataPointGroupDirectionDict = {
  'below': 'column',
  'above': 'column-reverse',
  'left': 'row-reverse',
  'right': 'row'
}

const DataPointGroup = styled.div`
  margin: 20px 5px;
  text-align: left;
  padding-left:10%
  width: 100%;
  display: flex;
  flex-shrink:0;
  flex-direction:column;
  align-items: center;
  justify-content: center;
`
const Divider = styled.div`
  background-color: #282828;
  height: 35vh;
  width: 1px;
`

const DataPoint = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  flex: 1;
  color: ${props => props.headerColor};
  font-size: ${props => props.headerSize}em;
  width:100%;
  a.drillable-link {
    color: ${props => props.headerColor};
    text-decoration: none;
  };
`

const DataPointTitle = styled.div`
  font-weight: bold;
  font-size: 30px;
  margin: 5px 0;
  color: #01535E
`

const DataPointValue = styled.div`
  font-size: 50px;
  font-weight: bolder;
  :hover {
    text-decoration: underline;
  }
  color: ${props => props.color}
`

class MultipleValue extends React.PureComponent {
  constructor(props) {
    super(props);

      this.state = {};
    this.state.groupingLayout = 'horizontal';
    this.state.fontSize = this.calculateFontSize();
  }

  componentDidMount() {
    window.addEventListener('resize', this.recalculateSizing);
  }

  componentDidUpdate() {
    this.recalculateSizing();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.recalculateSizing);
  }

  getWindowSize = () => {
    return Math.max(window.innerWidth, window.innerHeight);
  }

  calculateFontSize = () => {
    const multiplier = this.state.groupingLayout === 'horizontal' ? 0.015 : 0.02;
    return Math.round(this.getWindowSize() * multiplier);
  }

  handleClick = (cell, event) => {
    cell.link !== undefined ? LookerCharts.Utils.openDrillMenu({
         links: cell.link,
         event: event
    }) : LookerCharts.Utils.openDrillMenu({
         links: [],
         event: event
    });
  }

  recalculateSizing = () => {
    const EM = 16;
      const groupingLayout = 'horizontal';
    let CONFIG = this.props.config;
    var font_size = (CONFIG.font_size_main != "" ? CONFIG.font_size_main : this.calculateFontSize());
    font_size = font_size / EM;


    this.setState({
      fontSize: font_size,
      groupingLayout
    });
  }

    determineRelative = (measure,dataPoints) => {
	console.log(dataPoints);
	var first = dataPoints[0];
	var rest = dataPoints.slice(1);
	console.log(rest);
	var compPoints = _.compact([rest[0]||null,rest[11]||null]);
	console.log(compPoints);
	console.log(measure);
	return compPoints.map((point,index) =>  {
	    var fValue = first[measure.name].value;
	    var nValue = point[measure.name].value;
	    console.log(nValue)
	    var change = fValue - nValue;
	    var percentage = Math.round((fValue / nValue) * 100) - 100;
	    return {change:change,
		    percentage:percentage,
		    up: change > 0,
		    index : index}})}




  render() {
      const {config, measure , data} = this.props;
      let CONFIG = this.props.config;
      let firstPoint = data[0][measure.name];
      let restPoints = data.slice(1);
      let pos = config[`pos_is_bad`];
      let important = this.determineRelative(measure,data);
      console.log(important)

    return (
      <DataPointsWrapper
        layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
        font={config['grouping_font']}
        style={{fontSize: `${this.state.fontSize}em`}}
        borderColor = {important[0].up - pos !=0  ? "#02545F" : "#F3C911"}
      >
              <>
              <GlobalStyle backgroundColor = {config["tile_background"]} />
              <DataPointGroup >
                <DataPoint 
                headerColor = {config['header_text_color']}
                headerSize = {config['header_text_size']}
                >
                    <DataPointTitle>
                      {config['title_overrride'] || measure.label}
                    </DataPointTitle>
                  <DataPointValue 
        onClick={() => { this.handleClick(firstPoint, event); }}
                    layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
                    color = {config['subtext_color']}
                  >
                    {firstPoint.rendered}
                  </DataPointValue>
                </DataPoint>
                {!important.length > 0 ? null : (
                  important.map((point,index) => {
                   
                    return (
                <ComparisonDataPoint 
                  config={config}
		  change = {point.change}
                  percChange= {point.percentage}
		  up = {point.up}
		  index = {point.index}
                  handleClick={this.handleClick}
		  
                />)}))}
              </DataPointGroup>
              </>
   
      </DataPointsWrapper>
    )

  }
}

MultipleValue.propTypes = {
  config: PropTypes.object,
  data: PropTypes.array,
};

export default MultipleValue;
