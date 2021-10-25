import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import _ from 'lodash';
import { createGlobalStyle } from 'styled-components';
import { ComparisonDataPoint } from './ComparisonDataPoint';
import SSF from "ssf";;

const GlobalStyle = createGlobalStyle`
body {
  background-color: ${props => props.backgroundColor}
}`;

const DataPointsWrapper = styled.div`
  font-family: "Open Sans", "Noto Sans JP", "Noto Sans", "Noto Sans CJK KR", Helvetica, Arial, sans-serif;
  height: 100%;
  display: grid;
  grid-template-columns: 0.1fr 1.4fr;
  grid-template-rows: 1.6fr 1.1fr 0.65fr 0.65fr;
  grid-template-areas: "Border Heading" "Border KPI" "Border Comparison1" "Border Comparison2";
`

const dataPointGroupDirectionDict = {
    'below': 'column',
    'above': 'column-reverse',
    'left': 'row-reverse',
    'right': 'row'
}

const DataPointTitle = styled.div`
  font-weight: bold;
  margin: 5px 0;
  color: #01535E;
  grid-area: Heading;
  font-size: 16px;
`

const DataPointValue = styled.div`
  font-size:18px;
  font-weight: bolder;
  grid-area:KPI;
  :hover {
    text-decoration: underline;
  }
  color: ${props => props.color}
`;

const Border = styled.div`
height:100%;
width:10px;
background-color:#00535e;
border-top-left-radius:10px;
border-bottom-left-radius:10px;
grid-area:Border`;

function tryFormatting(formatString, value, defaultString) {
    try{

	return SSF.format(formatString, value);}
    catch(err){
	return defaultString()}
}

class MultipleValue extends React.PureComponent {
    constructor(props) {
	super(props);

	this.state = {};
	this.state.groupingLayout = 'vertical';
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
	const multiplier = this.state.groupingLayout === 'horizontal' ? 0.015 : 0.04;
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
	const groupingLayout = 'vertical';
	let CONFIG = this.props.config;
	var font_size = (CONFIG.font_size_main != "" ? CONFIG.font_size_main : this.calculateFontSize());
	font_size = font_size / EM;


	this.setState({
	    fontSize: font_size,
	    groupingLayout
	});
    }

    determineRelative = (measure,dataPoints) => {
	var first = dataPoints[0];
	var rest = dataPoints.slice(1);
	var compPoints = _.compact([rest[0]||null,rest[11]||null]);
	return compPoints.map((point,index) =>  {
	    var fValue = first[measure.name].value;
	    var nValue = point[measure.name].value;
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
	const formattedValue = tryFormatting(config.value_format,firstPoint.value,"NA");



	return (
		<DataPointsWrapper
            layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
            font={config['grouping_font']}
            style={{fontSize: '9px'}}>
		<>
		<GlobalStyle backgroundColor = {config["tile_background"]} />
		<Border></Border>
	<DataPointTitle>
                {config['title_override'] || measure.label}
        </DataPointTitle>
		<DataPointValue
            onClick={() => { this.handleClick(firstPoint, event); }}
            layout={config['orientation'] === 'auto' ? this.state.groupingLayout : config['orientation']}
            color = {config['subtext_color']}
                >
                {formattedValue}
            </DataPointValue>
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
