import React, {Component} from 'react';

import {
  Dimensions,
  StyleSheet,
  View,
  TouchableWithoutFeedback
} from 'react-native';

var window = Dimensions.get('window');

var styles = StyleSheet.create({
  outerCircle: {
    height: 16,
    width: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2 / window.scale,
    borderRadius: 8,
    backgroundColor: 'transparent'
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5
  }
});

class Circle extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { color, isSelected, selectedColor } = this.props;

    let innerCircle;
    let appliedColor;

    if (isSelected) {
      appliedColor = selectedColor;
      innerCircle = <View style={[styles.innerCircle, { backgroundColor: appliedColor }]}/>;
    } else {
      appliedColor = color;
      innerCircle = null;
    }

    return (
      <View style={{ padding: 1 }}>
        <View style={[styles.outerCircle, { borderColor: '#00b5e9' }]}>
          {innerCircle}
        </View>
      </View>
    );
  }
}

Circle.propTypes = {
  color: React.PropTypes.string,
  selectedColor: React.PropTypes.string,
  isSelected: React.PropTypes.bool
};

Circle.defaultProps = {
  isSelected: false
};

class Radio extends Component {
  constructor(props) {
    super(props);

    if (!this.props.defaultSelects) {
      throw new Error('failed to get defaultProps in constructor: ', props, this.props);
    }
    this.state = { selectedIndexs: this.props.defaultSelects };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.defaultSelects) {
      this.setState({selectedIndexs: nextProps.defaultSelects});
    }
  }

  _onSelect(index) {
    if (this.props.forbidEdit) return;

    var { onSelect } = this.props;

    let currentSelects = this.state.selectedIndexs;
    if (this.props.multiSelectable) {
      currentSelects[index] = !currentSelects[index];
    }else {
      let newSelects = {};
      newSelects[index] = !currentSelects[index];
      currentSelects = newSelects;
    }

    this.setState({
      selectedIndexs: currentSelects
    });
    onSelect(index, currentSelects);
  }

  render() {
    var { selectedIndexs } = this.state;

    console.log('currentSelects: ', selectedIndexs);

    var children = React.Children.map(this.props.children, (child, index) => {
      if (child.type === Option) {
        return React.cloneElement(child, {
          onPress: () => this._onSelect(index),
          isSelected: selectedIndexs[index] ? true : false,
        });
      }

      return child;
    });

    return (
      <View style={[{flex:1}, this.props.style]} >
        {children}
      </View>
    );
  }
}

Radio.propTypes = {
  onSelect: React.PropTypes.func.isRequired,
  defaultSelects: React.PropTypes.object,
  multiSelectable: React.PropTypes.bool,
  forbidEdit: React.PropTypes.bool,
};

Radio.defaultProps = {
  defaultSelects: {0:true}
};

class Option extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { style, onPress, isSelected, color, selectedColor, children } = this.props;

    return (
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={[style]}>
        <View style={{flexDirection: 'row', alignItems:'flex-start'}}>
          <Circle color={color} selectedColor={selectedColor} isSelected={isSelected}/>
          <View style={{ flex: 1 }}>
            {children}
          </View>
        </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

Option.propTypes = {
  onPress: React.PropTypes.func,
  isSelected: React.PropTypes.bool,
  color: React.PropTypes.string,
  selectedColor: React.PropTypes.string
};

Radio.Option = Option;
module.exports = Radio;
