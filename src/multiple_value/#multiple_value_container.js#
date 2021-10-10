import React from 'react';
import ReactDOM from 'react-dom';
import isEqual from 'lodash/isEqual';
import MultipleValue from './multiple_value';
import SSF from "ssf";

const baseOptions = {
    title_override : {
	label : "Title Override",
	type: "string",
	section:"Style"},
    font_size_main: {
	label: "Font Sizes",
	type: 'string',
	section: 'Style',
	default: "",
	display_size: 'normal'
    },
    orientation: {
	label: "Orientation",
	type: 'string',
	section: 'Style',
	display: 'select',
	values: [
	    {'Auto': 'auto'},
	    {'Vertical': 'vertical'},
	    {'Horizontal': 'horizontal'}
	],
	default: 'auto',
	display_size: 'normal'
    },
    pos_is_bad: {
	label: "Positive is bad",
	type: 'boolean',
	section: 'Comparison',
	default: false,
	display_size: 'normal'
    },
    tile_background : {
	type: `string`,
	label: `Tile Background`,
	display: `color`,
	default: '#FFFFFF',
	section: 'Style'
    },

    subtext_color : {
	type: `string`,
	display_size: 'normal'
    },
    value_format: {
	type:'string',
	label:` Value Format`,
        section: 'Style',
	display: 'select',
	values: [
	    {'General' :"#,##0"},
	    {'Thousands': '#.#,"K"'},
	    {'Millions': '0.00,,"M"'},
	    {'Percent':"#,##0%"}
	],
        default: '#.#,"K"'}};


    let currentOptions = {};
    let currentConfig = {};


    looker.plugins.visualizations.add({
	id: "multiple_value",
	label: "Multiple Value",
	options: baseOptions,
	create: function(element, config) {
	    this.chart = ReactDOM.render(
		<MultipleValue
		  config={{}}
		  measure={{}}
		  data={[]}
		  />,
		element
	    );

	},

	
	updateAsync: function(data, element, config, queryResponse, details, done) {
	    this.clearErrors();

	    const measures = queryResponse.fields.measures;
	    
	    if (measures.length == 0) {
		this.addError({title: "No Measures", message: "This chart requires measures"});
		return;
	    }
	    
	    if (queryResponse.fields.pivots.length) {
		this.addError({title: "Pivoting not allowed", message: "This visualization does not allow pivoting"});
		return;
	    }
	    
	    if (measures.length > 1) {
		this.addError({title: "Maximum number of data points", message: "This visualisation only allows one measure"})
		return;
	    }

	    const options = Object.assign({}, baseOptions);
	    const measure = measures[0];


	    
	    if (
		!isEqual(currentOptions, options) ||
		    !isEqual(currentConfig, config)
	    ) {
		this.trigger('registerOptions', options);
		currentOptions = Object.assign({}, options);
		currentConfig = Object.assign({}, config);
	    }
	    
	    this.chart = ReactDOM.render(
		<MultipleValue
		  config={config}
		  measure = {measure}
		  data={data}
		  />,
		element
	    );
	    done();
	}
    });
