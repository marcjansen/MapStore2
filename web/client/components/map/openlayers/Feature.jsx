/**
 * Copyright 2015, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

var React = require('react');
var ol = require('openlayers');
const {isEqual} = require('lodash');

let Feature = React.createClass({
    propTypes: {
        type: React.PropTypes.string,
        properties: React.PropTypes.object,
        container: React.PropTypes.object, // TODO it must be a ol.layer.vector (maybe pass the source is more correct here?)
        geometry: React.PropTypes.object // TODO check for geojson format for geometry
    },
    componentDidMount() {
        var format = new ol.format.GeoJSON();
        if (this.props.container) {
            this._feature = format.readFeatures({type: this.props.type, properties: this.props.properties, geometry: this.props.geometry});
            this._feature.forEach((f) => f.getGeometry().transform('EPSG:4326', 'EPSG:3857')); // TODO support map reference system
            this.props.container.getSource().addFeatures(this._feature);
        }
    },
    componentWillReceiveProps(newProps) {
        if (!isEqual(newProps.properties, this.props.properties) || !isEqual(newProps.geometry, this.props.geometry)) {
            if (this._feature) {
                if (Array.isArray(this._feature)) {
                    this._feature.forEach((feature) => {this.props.container.getSource().removeFeature(feature); });
                } else {
                    this.props.container.getSource().removeFeature(this._feature);
                }
            }
            let format = new ol.format.GeoJSON();
            if (newProps.container) {
                this._feature = format.readFeatures({type: newProps.type, properties: newProps.properties, geometry: newProps.geometry});
                this._feature.forEach((f) => f.getGeometry().transform('EPSG:4326', 'EPSG:3857')); // TODO support map reference system
                newProps.container.getSource().addFeatures(this._feature);
            }
        }
    },
    shouldComponentUpdate(nextProps) {
        return !isEqual(nextProps.properties, this.props.properties) || !isEqual(nextProps.geometry, this.props.geometry);
    },
    componentWillUnmount() {
        if (this._feature) {
            if (Array.isArray(this._feature)) {
                this._feature.forEach((feature) => {this.props.container.getSource().removeFeature(feature); });
            } else {
                this.props.container.getSource().removeFeature(this._feature);
            }
        }
    },
    render() {
        return null;
    }
});

module.exports = Feature;
